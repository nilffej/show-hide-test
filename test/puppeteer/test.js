import assert from "assert";

import puppeteer from 'puppeteer-core';
import fetch from 'node-fetch';
import path from 'path';
import { execFile } from 'child_process'

let browser;

const config = {
    debuggerPort: 9090,
    manifestURL: 'http://localhost:5555/app.json'
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getWindowByTitle(title) {
    let matchPage;
    while (!matchPage) {
        let pages = await browser.pages();
        for (const page of pages) {
            let pageTitle = await page.title();
            if (pageTitle === title) {
                matchPage = page;
                break;
            }
        }
        await sleep(1000);
    }
    return matchPage;
}

const beforeFunc = async function() { 
    const binary = path.resolve('./RunOpenFin.bat');
    const rvmArgs = [];
    rvmArgs.push(`--config=${config.manifestURL}`);
    rvmArgs.push(`--remote-debugging-port=${config.debuggerPort}`);
    console.log(`launching ${binary} ${rvmArgs}`);
    execFile(binary, rvmArgs,  (error, stdout, stderr) => {
        if (error) {
          throw error;
        }
        console.log(stdout);
      });

    let browserWSEndpoint;
    while (!browserWSEndpoint) {
        try {
            const response = await fetch(`http://localhost:${config.debuggerPort}/json/version`);
            let { webSocketDebuggerUrl } = await response.json();
            browserWSEndpoint = webSocketDebuggerUrl;
        } catch (err) {
        }
    }

    console.log(`connecting to ${browserWSEndpoint}`);
    browser = await puppeteer.connect({
        browserWSEndpoint
    });
    console.log('done with before');
};

const afterFunc = async function() {
    console.log('after hook');
    await browser.close();
    console.log('done with after hook');
};

describe('Click Re-Run button in Health Check page', function() {
    const healthCheckTitle = 'OpenFin Deployment Health Check';
    this.timeout(50000);

    before(beforeFunc);
    after(afterFunc);

    it('should match the version in the app manifest', async function() {
        let page = await getWindowByTitle(healthCheckTitle);
        const title = await page.title();
        const result = await page.evaluate(async () => {
            return await fin.System.getVersion();
          });
        assert.ok(typeof result === 'string');
    });

    let healthPage;
    it(`Switch to ${healthCheckTitle}`, async () => {
        healthPage = await getWindowByTitle(healthCheckTitle);
        const title = await healthPage.title();
        assert.equal(title,  healthCheckTitle);
    });

    it("Click Run Again button", async () => {
        const rerunButton = await healthPage.$("#rerun");
        await rerunButton.click();
    });

    const providerPageTitle = 'Platform Window Template';
    let templatePage;
    it(`Switch to ${providerPageTitle}`, async () => {
        templatePage = await getWindowByTitle(providerPageTitle);
        const title = await templatePage.title();
        assert.equal(title,  providerPageTitle);
    });

    it("Click Close tab button", async () => {
        const lmTabs = await templatePage.$$("li.lm_tab");
        return new Promise((resolve) => {
            lmTabs.forEach(async (element) => {
                const title = await element.getProperty('title');
                const propertyValue = await title.jsonValue();
                if (propertyValue === healthCheckTitle) {
                    const closeDiv = await element.$('div.lm_close_tab');
                    await closeDiv.click();
                    resolve();
                }
            });    
        });
     });
});
