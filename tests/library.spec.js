const { Builder, By, until } = require('selenium-webdriver');
const fs = require('fs');
const path = require('path');  

describe("library", () => {
    let driver;

    before(async () => {
        driver = await new Builder().forBrowser('chrome').build();
    });

    after(async () => {
        await driver.quit();
    });

    async function ensureDirectoryExists(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    async function takeScreenshot(filename) {
        const screenshot = await driver.takeScreenshot();
        const directoryPath = path.join(__dirname, 'images');
        await ensureDirectoryExists(directoryPath);
        const filePath = path.join(directoryPath, filename);
        fs.writeFileSync(filePath, screenshot, 'base64');
    }

    it("online library with nav bar", async () => {
        try {
            await driver.get('file:///C:/Users/LENOVO/Desktop/Libray%20Online/index.html');

            // Tomar captura de pantalla después de cargar la página principal
            await takeScreenshot('screenshot1.png');

            // Encontrar el enlace por su XPath
            const link = await driver.findElement(By.xpath('//nav//a[contains(text(), "Autores")]'));

            // Hacer clic en el enlace
            await link.click();

            // Tomar captura de pantalla después de hacer clic en el enlace
            await takeScreenshot('screenshot2.png');

            // Esperar a que aparezca la barra de búsqueda
            await driver.wait(until.elementLocated(By.className('search-bar')), 5000);

            // Ingresar texto en la barra de búsqueda
            await driver.findElement(By.className('search-input')).sendKeys('Ernest Hemingway');

            // Encontrar y hacer clic en el botón de búsqueda
            const buscarButton = await driver.findElement(By.xpath('//div[@class="search-bar"]//button[text()="Buscar"]'));
            await buscarButton.click();

            // Tomar captura de pantalla después de hacer clic en el botón de búsqueda
            await takeScreenshot('screenshot3.png');

            await driver.sleep(5000);
        } catch (error) {
            console.error(error);
            // Si hay un error, también tomamos una captura de pantalla
            await takeScreenshot('error-screenshot.png');
        }
    });
});
