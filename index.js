const puppeteer = require("puppeteer")
require("dotenv").config()

const getTodaysDate = () => {
	const today = new Date().toLocaleDateString()

	return today
}

const getAllLogs = async (page) => {
	await page.waitForSelector("tr")

	const timeLogs = await page.$$eval(".col-md-2", (el) =>
		el.map((el) => el.textContent)
	)

	const individualLogSize = 5
	let splitLogs = []
	for (let i = 5; i < timeLogs.length; i += individualLogSize) {
		const chunk = timeLogs.slice(i, i + individualLogSize)
		splitLogs.push(chunk)
	}

	return splitLogs
}

const filterTodaysLogs = (getAllTime) => {
	const todaysDate = getTodaysDate()

	let todaysLogs = []

	for (let i = 0; i < getAllTime.length; i++) {
		if (getAllTime[i][2] === todaysDate) {
			todaysLogs.push(getAllTime[i])
		}
	}
	return todaysLogs
}

const beginEOD = async () => {
	const browser = await puppeteer.launch()
	const page = await browser.newPage()

	let getAllTime = []
	let getTodaysTime = []

	await page.goto("https://servicio.tech-niche.net/#/login?redirect=%2F")

	await page.waitForSelector("#email")

	await page.type("#email", process.env.EMAIL)

	await page.type("#password", process.env.PW)

	await page.click(".btn-primary")

	await page.waitForNavigation()

	await page.waitForSelector("tr")

	let selectOptions = await page.$$eval("option", (el) =>
		el.map((option) => option.textContent)
	)

	const highestSelectOption = selectOptions.length - 1

	selectOptions = selectOptions[highestSelectOption]

	switch (selectOptions) {
		case "10":
			await page.select("select", "10")
			getAllTime = await getAllLogs(page)
			getTodaysTime = filterTodaysLogs(getAllTime)
			break
		case "25":
			await page.select("select", "25")
			getAllTime = await getAllLogs(page)
			getTodaysTime = filterTodaysLogs(getAllTime)
			break
		case "50":
			await page.select("select", "50")
			getAllTime = await getAllLogs(page)
			getTodaysTime = filterTodaysLogs(getAllTime)
			break
		case "100":
			await page.select("select", "100")
			getAllTime = await getAllLogs(page)
			getTodaysTime = filterTodaysLogs(getAllTime)
			break
	}

	await browser.close()
}

beginEOD()
