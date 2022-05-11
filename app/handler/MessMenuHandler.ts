import express from "express"
import puppeteer from "puppeteer-core"
import CONST from "../../utils/Const"
import {errorToJSON} from "../../utils/Helpers";

async function MessMenuHandler(req: express.Request, res: express.Response) {

    // Check for browser env
    const browserPath = process.env.CHRPATH
    if (!browserPath) {
        res.status(500).send(errorToJSON("No exported variable `CHRPATH` found in env."))
        console.error("No exported variable `CHRPATH` found in env.")
        return
    }

    // Load and render page
    const browser = await puppeteer.launch({executablePath: browserPath, args: ['--no-sandbox']}).catch(e => {
        console.error(e);
        res.status(500).send(errorToJSON(e))
    })

    if (!browser)
        return

    const page = await browser.newPage().catch(err => {
        console.error(err)
        res.status(500).send(errorToJSON(err))
    })

    if (!page)
        return

    // Send the request to the new page
    await page.goto(CONST.MESS_MENU_URL, {waitUntil: "networkidle2"}).catch(err => {
        console.error(err);
        res.status(500).send(errorToJSON(err))
    })

    // Define the xPaths in a human-readable form
    type MessFields = {
        last_updated_at: string
        breakfast: string
        lunch: string
        high_tea: string
        dinner: string
    }

    const xPaths: MessFields = {
        last_updated_at: '//*[@id="root"]/div/div[2]/div[2]/div/p',
        breakfast: '//*[@id="root"]/div/div[2]/div[2]/div/div[1]/p',
        lunch: '//*[@id="root"]/div/div[2]/div[2]/div/div[2]/p',
        high_tea: '//*[@id="root"]/div/div[2]/div[2]/div/div[3]/p',
        dinner: '//*[@id="root"]/div/div[2]/div[2]/div/div[4]/p'
    }

    let resp: { [k: string]: string | string[] } = {}

    // Prepare the values
    for (const key of Object.keys(xPaths)) {
        const currPath = xPaths[key as keyof typeof xPaths]
        const [element] = await page.$x(currPath)
        let eleData: string = await page.evaluate(el => el.textContent, element).catch(() => "NA")

        if (key == "last_updated_at" && eleData != "NA")
            eleData = eleData.split('-')[1].trim()

        resp[key] = eleData.split(',').map(v => {
            if (v)
                v.trim()

            return v
        })
    }

    // Find last updated meal
    resp["last_updated_meal"] = "NA"
    for (let meal of Object.keys(xPaths)) {
        if (meal == "last_updated_at")
            continue

        if (resp[meal] != 'Not yet updated.') {
            resp["last_updated_meal"] = meal
        }
    }

    // Close the browser
    await page.close()
    await browser.close()

    // Send the repsonse
    res.send(resp)
}

export default MessMenuHandler
