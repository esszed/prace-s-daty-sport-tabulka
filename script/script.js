class Table {
	constructor(containerId, htmlClass, id) {
		this.containerId = containerId
		this.container = document.getElementById(containerId)
		this.htmlClass = htmlClass
		this.id = id
	}
	createTable(arrayOfObjects) { // vytváří tabulku z pole objektů, možnost přidat tabulce html id a class
		this.html = `<table class='${this.htmlClass}' id='${this.id}'>`
		this.html += '<thead>'
		for (let j in arrayOfObjects[0]) {
			this.html += `<th> ${j} </th>`
		}
		this.html += '</thead>'
		for (let i = 0; i < arrayOfObjects.length; i++) {
			this.html += '<tr >'
			for (let j in arrayOfObjects[i]) {
				this.html += `<td> ${arrayOfObjects[i][j]}</td>`
			}
			this.html += '</tr>'
		}
		this.html += '</table>'
		this.container.innerHTML = this.html
	}
	makeCellsEditable(startRow, collumn) { // editovatelné buňky pro poslední otázku 
		this.tableElement = document.getElementById(this.id)
		for (let i = startRow; i < this.tableElement.rows.length; i++) {
			this.tableElement.rows[i].cells[collumn].contentEditable = 'true'
		}
	}
}
class SportTable extends Table {
	constructor(containerId, htmlClass, id) {
		super(containerId, htmlClass, id)
	}
	generateMatches(teamsArray, minScore, maxScore) { // parametry: array s názvy týmů, minimální možné skore, maximální možné skore v zápase
		//generování hodnot-> vytvoří se zápas, vygeneruje se náhodně skore
		this.array = []
		this.match
		for (let i = 0; i < teamsArray.length - 1; i++) {
			if (i != teamsArray.length) {
				for (let j = i + 1; j < teamsArray.length; j++) {
					this.score1 =
						Math.floor(Math.random() * (maxScore - minScore)) + minScore
					this.score2 =
						Math.floor(Math.random() * (maxScore - minScore)) + minScore
					this.match = {
						team1: teamsArray[i],
						team2: teamsArray[j],
						score1: this.score1,
						score2: this.score2
					}
					this.array.push(this.match)
				}
			}
		}
		return this.array
	}
	addToTeam(t, w, d, l, s1, s2) {
		if (this.result[t] == null)
			return (this.result[t] = {
				Pořadí: 0,
				Stát: t,
				Výhry: w,
				Remízy: d,
				Prohry: l,
				Vstřeleno: s1,
				Obdrženo: s2
			})
		this.result[t].Výhry += w
		this.result[t].Remízy += d
		this.result[t].Prohry += l
		this.result[t].Vstřeleno += s1
		this.result[t].Obdrženo += s2
	}
	createTableValues(matchesArray, winPoints, drawPoints, lossPoints) { // z generovaných zápasů se udělá tabulka parametry- array zápasů, body za výhru, body za prohru
		this.result = {}
		matchesArray.forEach(m => { // podle skore se určuje výhra/prohra/remíza
			if (m.score1 > m.score2) {
				this.addToTeam(m.team1, 1, 0, 0, m.score1, m.score2)
				this.addToTeam(m.team2, 0, 0, 1, m.score2, m.score1)
			} else if (m.score1 < m.score2) {
				this.addToTeam(m.team1, 0, 0, 1, m.score1, m.score2)
				this.addToTeam(m.team2, 1, 0, 0, m.score2, m.score1)
			} else {
				this.addToTeam(m.team1, 0, 1, 0, m.score1, m.score2)
				this.addToTeam(m.team2, 0, 1, 0, m.score2, m.score1)
			}
		})
		this.result = Object.values(this.result)
		//výpočet bodů
		this.result.forEach(object => object.Body = object.Výhry * winPoints + object.Remízy * drawPoints + object.Prohry * lossPoints)
		//aby neměli první dva stejné skore kvůli otázce č1
		this.result.sort((a, b) => b.Vstřeleno - a.Vstřeleno)
		if (this.result[0].Vstřeleno == this.result[1].Vstřeleno) {
			this.result[0].Vstřeleno += 1
			this.result[1].Obdrženo += 1
		}
		this.result.sort((a, b) => b.Body - a.Body) // přídává pořadí
		this.result.forEach((object, index) => object.Pořadí = index + 1 + '.')
		return this.result
	}
}
class Verifikace {
	constructor(tableObject1, tableObject2, tableobject3, teamArray, teamSelect, introEasy, introMedium, introHard, otazky, intro, questionIntro, confirmButtonMain, confirmButton1, confirmButton2, confirmButton3, confirmButton4, difficulty, drawPointsInput, winPointsInput, lossPointsInput, questOneVar, firstQuestionVariances, drawSpan) {
		this.table = tableObject1
		this.table1 = tableObject2
		this.table2 = tableobject3
		this.teamArray = teamArray
		this.teamSelect = document.getElementById(teamSelect)
		this.introEasy = document.getElementById(introEasy)
		this.introMedium = document.getElementById(introMedium)
		this.introHard = document.getElementById(introHard)
		this.otazky = document.querySelector(`ul.${otazky}`)
		this.firstQvar = document.querySelector(`ul.${firstQuestionVariances}`)
		this.intros = document.getElementsByClassName(intro)
		this.introQuestions = document.getElementById(questionIntro)
		this.confirmButtonMain = document.getElementById(confirmButtonMain)
		this.confirmButton1 = document.getElementById(confirmButton1)
		this.confirmButton2 = document.getElementById(confirmButton2)
		this.confirmButton3 = document.getElementById(confirmButton3)
		this.confirmButton4 = document.getElementById(confirmButton4)
		this.difficulty = document.getElementById(difficulty)
		this.drawPointsInput = document.getElementById(drawPointsInput)
		this.winPointsInput = document.getElementById(winPointsInput)
		this.lossPointsInput = document.getElementById(lossPointsInput)
		this.questionOnePara = document.getElementsByClassName(questOneVar)
		this.drawSpan = document.getElementById(drawSpan)
 		this.pointsArray = [
      	{ win: 2, draw: 1, loss: 0 },
      	{ win: 4, draw: 2, loss: 0 },
      	{ win: 5, draw: 3, loss: 1 },
      	{ win: 6, draw: 3, loss: 1 }
    	]
  }
	
	shuffleQuestions() { //nahodně zamíchá otázky
		for (let i = this.otazky.children.length; i >= 0; i--) {
			this.otazky.appendChild(this.otazky.children[(Math.random() * i) | 0])
		}
	}
	showQuestions(next) { //zobrazuje další otázky
		for (let i = 0; i < this.otazky.children.length; i++) {
			this.otazky.children[i].style.display = 'none'
		}
		if (next) { //další otázka
			this.questionNum++
		}
		if (this.questionNum == this.otazky.children.length) { //všechny otázky zodpovězeny
			this.introQuestions.style.display = 'none'
			this.hideIntros()
			document.getElementById('container').style.display = 'none'
			print_modal('modal', 'ok', 'Gratuluji! Správně jsi dokončil celý příklad')
		} else {
			this.otazky.children[this.questionNum].style.display = 'block'
		}
	}
	hideIntros() { //schová všechny intro paragrafy
		for (let i = 0; i < this.intros.length; i++) {
			this.intros[i].style.display = 'none'
		}
	}
	shuffleArray(array, number) { //shuffle arraye, number=počet prvků z původní arraye kolik se zachová
		let resultArray = []
		array.sort(() => Math.random() - 0.5)
		for (let i = 0; i < number; i++) {
			resultArray.push(array[i])
		}
		return resultArray
	}
	fillSelect() {
		//maže select pro otázku č1
		for (let i = this.teamSelect.options.length; i >= 0; i--) {
			this.teamSelect.options[i] = null
		}
		//přidává prázdny option 
		let emptyOption = document.createElement('option')
		emptyOption.appendChild(document.createTextNode(''))
		emptyOption.value = ''
		this.teamSelect.appendChild(emptyOption)
		//přidává optiony z arraye
		this.array.sort()
		this.array.forEach(element => {
			let option = document.createElement('option')
			option.appendChild(document.createTextNode(element))
			option.value = element
			this.teamSelect.appendChild(option)
		})
	}
	randomFirstQuestion() {
		this.randomNumber = Math.floor(Math.random() * this.firstQvar.children.length)
		for (let i = 0; i < this.firstQvar.children.length; i++) {
			this.firstQvar.children[i].style.display = "none"
		}
		this.firstQvar.children[this.randomNumber].style.display = "block"
	}
	fillTables() {
		this.confirmButtonMain.addEventListener('click', () => {
			this.shuffleQuestions()
			this.questionNum = 0
			this.hideIntros()
			this.showQuestions()
			this.drawPointsInput.value = ""
			this.winPointsInput.value = ""
			this.lossPointsInput.value = ""
			this.table.container.style.display = 'block'
			this.drawSpan.style.display = "none"
			this.points = this.shuffleArray(this.pointsArray, 1)
			switch (this.difficulty.value) { //obtížnosti 
				case 'easy':
					this.string = 'košů'
					this.introEasy.style.display = 'block'
					this.array = this.shuffleArray(this.teamArray, 4) //bere náhodně 4 země z arraye
					this.values = this.table.generateMatches(this.array, 35, 60)
					break
				case 'medium':
					this.string = 'branek'
					this.introMedium.style.display = 'block'
					this.array = this.shuffleArray(this.teamArray, 6) //bere náhodně 6 zemí z arraye
					this.values = this.table.generateMatches(this.array, 10, 25)
					break
				case 'hard': //hard obtížnost bere vždy celou array
					this.string = 'branek'
					this.introHard.style.display = 'block'
					this.array = this.teamArray
					this.values = this.table.generateMatches(this.array, 0, 6)
					break
			}
			this.modifyValues = this.table.createTableValues(this.values, this.points[0].win, this.points[0].draw, this.points[0].loss)
			this.table.createTable(this.modifyValues)
			this.table1.createTable(this.modifyValues)
			this.table2.createTable(this.modifyValues)
			this.table1.bindMouse() //aplikuje dragNdrop
			this.table2.bindMouse() //aplikuje dragNdrop
			this.table2.makeCellsEditable(1, 7)
			this.fillSelect()
			this.randomFirstQuestion()
			this.changedValues = this.modifyValues //připrava pro kontrolu třetí tabulky
			this.changedValues.forEach(object => object.Body += object.Výhry)
			for (let i = 0; i < this.questionOnePara.length; i++) {
				this.questionOnePara[i].innerHTML = this.string
			}
			this.isDraw = false
			for (let i = 0; i < this.modifyValues.length; i++) {
				if (this.modifyValues[i].Remízy > 0) {
					this.isDraw = true
				}
			}
			if (this.isDraw) {
				this.drawSpan.style.display = 'block'
			}
		})
	}
	questionCheck1() {
		this.confirmButton1.addEventListener('click', () => {
			switch (this.randomNumber) {
				case 0:
					this.sortedTable = this.modifyValues.sort((a, b) => b.Vstřeleno - a.Vstřeleno)
					break
				case 1:
					this.sortedTable = this.modifyValues.sort((a, b) => a.Vstřeleno - b.Vstřeleno)
					break
				case 2:
					this.sortedTable = this.modifyValues.sort((a, b) => b.Obdrženo - a.Obdrženo)
					break
				case 3:
					this.sortedTable = this.modifyValues.sort((a, b) => a.Obdrženo - b.Obdrženo)
			}
			if (this.teamSelect.value == this.sortedTable[0].Stát) {
				print_modal('modal', 'ok')
				this.showQuestions('true')
			} else {
				print_modal('modal', 'neutr', 'To ještě není úplně správně')
			}
		})
	}
	questionCheck2() {
		this.confirmButton2.addEventListener('click', () => {
			let wrong = false
			this.table1Element = document.getElementById(this.table1.id)
			for (let i = 1; i < this.table1Element.rows.length - 1; i++) {
				this.difference1 =
					this.table1Element.rows[i].cells[5].innerHTML -
					this.table1Element.rows[i].cells[6].innerHTML
				this.difference2 =
					this.table1Element.rows[i + 1].cells[5].innerHTML -
					this.table1Element.rows[i + 1].cells[6].innerHTML
				if (this.difference1 < this.difference2) {
					wrong = true
				}
			}
			if (!wrong) {
				print_modal('modal', 'ok')
				this.showQuestions('true')
			} else {
				print_modal('modal', 'neutr', 'To ještě není úplně správně')
			}
		})
	}
	questionCheck3() {
		this.confirmButton3.addEventListener('click', () => {
			switch (this.isDraw) {
				case true:
					this.cond = this.winPointsInput.value == this.points[0].win && this.drawPointsInput.value == this.points[0].draw && this.lossPointsInput.value == this.points[0].loss
					break
				case false:
					this.cond = this.winPointsInput.value == this.points[0].win && this.lossPointsInput.value == this.points[0].loss
					break
			}
			if (this.cond) {
				print_modal('modal', 'ok')
				this.showQuestions('true')
			} else {
				print_modal('modal', 'neutr', 'To ještě není úplně správně')
			}
		})
	}
	questionCheck4() {
		this.confirmButton4.addEventListener('click', () => {
			this.changedValues.sort((a, b) => b.Body - a.Body)
			this.table2element = document.getElementById(this.table2.id)
			let wrong = false
			for (let i = 1; i < this.table2element.rows.length; i++) {
				if (
					this.table2element.rows[i].cells[7].innerHTML != this.changedValues[i - 1].Body
				) {
					this.table2element.rows[i].cells[7].style.backgroundColor = 'red'
					wrong = true
				} else {
					this.table2element.rows[i].cells[7].style.backgroundColor = 'green'
				}
			}
			if (wrong == true) {
				print_modal(
					'modal', 'neutr', `To není úplně správně. Buňky se špatnými odpověďmi jsou ozančeny červeně`
				)
			} else {
				print_modal('modal', 'ok')
				this.showQuestions('true')
			}
		})
	}
}
class LoadData {
	constructor() {}
	static load() {
		const sportTable1 = new SportTable('container', 'capI', 'table')
		const sportTable2 = new DraggableTable('container1', 'capI draggable-table', 'table1')
		const sportTable3 = new DraggableTable('container2', 'capI draggable-table', 'table2')
		let teamArray = ['Česko', 'Slovensko', 'Itálie', 'Španělsko', 'Portugalsko', 'Německo', 'USA', 'Maďarsko', 'Spojené Králoství', 'Rusko']
		const verifikace = new Verifikace(sportTable1, sportTable2, sportTable3, teamArray, 'teamSelect', 'introEasy', 'introMedium', 'introHard', 'otazky', 'intro', 'questionIntro', 'acceptDif', 'confirm1', 'confirm2', 'confirm3', 'confirm4', 'difficulty', 'drawPoints', 'winPoints', 'lossPoints', 'questOneVar', 'firstQuestion', 'drawPointsSpan')
		verifikace.fillTables()
		verifikace.questionCheck1()
		verifikace.questionCheck2()
		verifikace.questionCheck3()
		verifikace.questionCheck4()
	}
}
window.addEventListener('load', () => {
	LoadData.load()
})
// Poznámky:
// Generování tabulky probíhá na základě vygenerování zápasů pro každý tým s každým týmem- zaznamenání výher, remiz a proher a vytvoření tabulky z nich 
// Pokud u kontroly mají dva týmy stejný počet bodů (u druhé otázky pokud je rozdíl stejný) na jejich pořadím nezáleží
// U jednoduché obtížnosti bude druhá otázka 85% času správně automaticky, u dalších obtížnostá už málokdy
// U jednoduché obtížnosti se u čtvrté otázky nikdy nezmění pořadí u střední obtížnosti už občas, ale né moc často - dá se ovlivnit maximálním a minimálním možným skorem (menší rozdíl mezi min a max = větší šance remíz a tím pádem větší šance, že tým s menším počtem výher bude v tabulce nad týmem s větším počtem výher a připočtení bodu za 