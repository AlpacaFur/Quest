"use strict";

const ICONS = {
  "complete": {
    viewBox: "0 0 41.76 41.76",
    paths: ["M20.88 0a20.88 20.88 0 100 41.76 20.88 20.88 0 000-41.76zm-1.44 30.61l-2.65 2.65-2.65-2.65-8-8 2.65-2.65 8 8 16.19-16.19 2.65 2.65-16.19 16.19z"]
  },
  "info": {
    viewBox: "0 0 42 42",
    paths: ["M22.27 14.7h-2.54a.83.83 0 01-.83-.83v-2.54c0-.46.37-.83.83-.83h2.54c.46 0 .83.37.83.83v2.54c0 .46-.37.83-.83.83zm.08 16.8h-2.69a.75.75 0 01-.75-.75v-11.1c0-.42.34-.75.75-.75h2.69c.42 0 .75.34.75.75v11.09c0 .42-.34.76-.75.76zM21 0a21 21 0 100 42 21 21 0 000-42z"]
  },
  "remove": {
    viewBox: "0 0 36 36",
    paths: ["M36 3.63L32.37 0 18 14.37 3.63 0 0 3.63 14.37 18 0 32.37 3.63 36 18 21.63 32.37 36 36 32.37 21.63 18 36 3.63z"]
  },
  "points": {
    viewBox: "0 0 32 32",
    paths: ["M16 0l-4.36 11.64L0 16l11.64 4.36L16 32l4.36-11.64L32 16l-11.64-4.36L16 0z"]
  }
}

function capitalize(string) {
  return string.slice(0,1).toUpperCase() + string.slice(1);
}

document.getElementById("refresh").addEventListener("click", ()=>{
  window.location.reload();
})
document.getElementById("reset").addEventListener("click", ()=>{
  localStorage.clear()
  window.location.reload();
})
// document.getElementById("add-quest").addEventListener("click", ()=>{
//   showQuests();
// })

// document.addEventListener("touchstart", function(){}, true);

// document.getElementById("box").addEventListener("click", ()=>{
// 	document.getElementById("quest").classList.toggle("completed")
// })

function createSVG(viewBox, paths) {
  let svg = document.createElementNS('http://www.w3.org/2000/svg','svg')
  svg.setAttribute("viewBox", viewBox)
  paths.forEach((path)=>{
    let pathElem = document.createElementNS('http://www.w3.org/2000/svg','path')
    pathElem.setAttribute("d", path)
    svg.appendChild(pathElem)
  })
  return svg;
}

function closeModal() {
  document.getElementById("modal-background").classList.add("hidden");
}

const quests = {
  "learn-word": {
    id: "learn-word",
    title: "Learn a new word!",
    summary: "Expand your vocabulary and learn a new word!",
    points: 5,
    resources: [
      {
        title: "Mirriam Webster's Word of the Day",
        simple_url:"merriam-webster.com",
        url: "https://www.merriam-webster.com/word-of-the-day"
      }
    ],
    categories: ["learning"]
  },
  "meet-person": {
    id: "meet-person",
    title: "Meet a new Person",
    alternateTitles: {
      "meet-online": "Meet a new Person Online"
    },
    points: 15,
    summary: "Talk to someone you haven't talked to before!",
    hide: [
      {
        title: "I'm socially distancing!",
        prompt: {
          type: "would-you-rather",
          action: "rename-quest",
          to: "meet-online"
        }
      }
    ],
    categories: ["social"]
  },
  "start-book": {
    id: "start-book",
    title: "Start Reading a Book",
    points: 20,
    summary: "Start reading a new book!",
    categories: ["learning"]
  },
  "write-short-story": {
    id: "write-short-story",
    title: "Write a Short Story",
    points: 50,
    summary: "Start reading a new book!",
    categories: ["learning"]
  },
  "take-walk": {
    id: "take-walk",
    title: "Go on a Walk",
    points: 10,
    summary: "Go on a walk, whether nearby or farther away!",
    categories: ["physical"],
    hide: [
      {
        title: "I have limited mobility",
        prompt: {
          type: "offer-category-removal",
          category: "physical"
        }
      }
    ]
  },
  "take-hike": {
    id: "take-hike",
    title: "Go on a Hike",
    points: 15,
    summary: "Go on a hike, whether nearby or farther away!",
    categories: ["physical"],
    hide: [
      {
        title: "There aren't any hiking locations nearby",
        prompt: {
          type: "would-you-rather",
          action: "hide-and-replace",
          to: "take-walk"
        }
      },
      {
        title: "I have limited mobility",
        prompt: {
          type: "offer-category-removal",
          category: "physical"
        }
      }
    ]
  },
}

const demoBirthdays = {
  "10/10": "Test Person",
  "10/11": "Another Person"
}

const bonusEvents = {
  "11/3": {
    id: "vote",
    title: "Vote!",
    summary: "Vote in this year's election!",
    points: 50,
    resources: {
      title: "Vote.gov",
      simple_url: "vote.gov",
      url: "https://vote.gov"
    },
    categories: ["Politics"]
  },
  "10/10": {
    id: "register-to-vote",
    title: "Register to Vote!",
    summary: "Make sure you're registered to vote in this year's election! Request a mail-in ballot if you plan to vote by mail.",
    points: 50,
    resources: {
      title: "Vote.gov",
      simple_url: "vote.gov",
      url: "https://vote.gov"
    },
    categories: ["Politics"]
  }
}

// difficulty -> relaxed, normal, challenge

class QuestPool {
  constructor(allQuests) {
    this.allQuests = allQuests;
    this.pulledQuests = [];
    // this.buildWeightTable(disabledQuests, disabledCategories, categoryMultipliers);
  }
  buildWeightTable(disabledQuests, disabledCategories, categoryMultipliers) {
    if (categoryMultipliers.base === undefined) throw new Error("No base weight!");
    this.weightTable = []
    this.currentTableSum = 0;
    Object.entries(this.allQuests).forEach(([id, quest]) => {
      if (disabledQuests.includes(id)) return;
      const isNotCategoryExcluded = quest.categories.every((category)=>{return !disabledCategories.includes(category)})
      if (isNotCategoryExcluded) {
        let multiplier = 1;
        if (quest.categories.length !== 0) {
          multiplier = quest.categories.reduce((accumulator, category)=>{
            return accumulator * (categoryMultipliers[category] || 1);
          }, 1)
        }
        let weight = Math.round(categoryMultipliers.base * multiplier)
        this.currentTableSum += weight;
        let entry = [weight, id]
        this.weightTable.push(entry);
      }
    })
  }
  pull() {
    if (this.weightTable.length === 0) return;
    let target = Math.floor(Math.random() * this.currentTableSum);
    let currentValue = 0;
    let index = this.weightTable.findIndex((value)=>{
      if (target <= currentValue + value[0]) return true;
      else currentValue += value[0];
    })
    let questId = this.weightTable[index][1];
    this.currentTableSum -= this.weightTable[index][0];
    this.weightTable.splice(index, 1)
    this.pulledQuests.push(questId);
    return this.allQuests[questId];
  }
}

class QuestDisplay {
  constructor(mainQuestElemId, bonusQuestElemId, logic) {
    this.dailyQuestElems = [];
    this.dailyQuestIds = [];
    this.logic = logic;
    this.points = 0;

    this.navList = [
      "pointsNav",
      "questNav",
      "settingsNav"
    ]

    this.navList.forEach((id, index)=>{
      document.getElementById(id).addEventListener("click", ()=>{

        this.switchPanes(index);
      })
    })


    this.currentPane = -1;

    this.switchPanes(1);
    document.getElementsByClassName("main")[0].classList.add("loaded")

    this.dailyQuestParent = document.getElementById(mainQuestElemId)
    this.bonusQuestParent = document.getElementById(bonusQuestElemId)

    this.bonusQuests = [];
  }
  changePoints(newTotal, skipAnimation) {
    document.getElementById("pointsDedicated").textContent = newTotal;
    if (skipAnimation) {
      document.getElementById("pointsMain").textContent = newTotal;
    }
    else {
      this.animateNumber(document.getElementById("pointsMain"), this.points, newTotal)
    }
    this.points = newTotal;
  }
  animateNumber(element, from, to) {
    let className = Math.sign(to - from) === 1 ? "adding" : "subtracting";
    if (this.numberAnimationID) {
      clearInterval(this.numberAnimationID);
      let oppositeClassName = Math.sign(to - from) === 1 ? "subtracting" : "adding";
      document.getElementById("pointsMainContainer").classList.remove(oppositeClassName);
    }

    document.getElementById("pointsMainContainer").classList.add(className);
    // document.getElementById("pointsMainContainer").classList.add("adding");
  	let step = 0;
    const steps = 17;
  	let stepIncrement = (to - from)/steps
  	let currentNumber = from;
  	this.numberAnimationID = setInterval(()=>{
  		if (step === steps) {
  			element.textContent = to;
  			clearInterval(this.numberAnimationID);
        document.getElementById("pointsMainContainer").classList.remove(className);
  		}
  		else {
  			currentNumber = currentNumber + stepIncrement
  			element.textContent = Math.round(currentNumber);
  			step++;
  		}
  	}, 50)
  }
  setModal(choices) {
    return new Promise((resolve, reject)=>{
      let modal = document.getElementById("modal")
      while (modal.firstChild) {
        modal.removeChild(modal.lastChild);
      }
      let frag = document.createDocumentFragment();
      choices.forEach((choice)=>{
        let div = document.createElement("div");
        if (choice.class) div.classList.add(choice.class);
        let text = document.createElement("p");
        text.textContent = choice.text;
        div.appendChild(text);
        let svg = createSVG(ICONS[choice.icon].viewBox, ICONS[choice.icon].paths);
        div.appendChild(svg);
        div.addEventListener("click", ()=>{
          resolve(choice.id)
        })
        frag.appendChild(div);
      })
      let close = document.createElement("div");
      close.classList.add("close");
      let closep = document.createElement("p")
      closep.textContent = "Close";
      close.appendChild(closep)
      close.addEventListener("click", ()=>{
        document.getElementById("modal-background").classList.add("hidden");
        resolve("close")
      })
      modal.appendChild(frag);
      modal.appendChild(close)
      document.getElementById("modal-background").classList.remove("hidden");
    })
  }
  switchPanes(paneIndex) {
    if (paneIndex === this.currentPane) return;
    if (this.currentPane !== -1) {
      document.getElementById(this.navList[this.currentPane]).classList.remove("active");
    }
    document.getElementById("main").scrollLeft=window.innerWidth*paneIndex-(20*paneIndex);
    document.getElementById(this.navList[paneIndex]).classList.add("active");
    this.currentPane = paneIndex;
  }
  showQuestModal(questId) {
    let completePhrase = this.logic.getQuest(questId).completed ? "Uncomplete Quest" : "Complete Quest!"
    this.setModal([
      {id:"complete", text:completePhrase, class:"complete", icon: "complete"},
      {id:"info", text:"More Info...", icon: "info"},
      {id:"hide", text:"Hide this Quest", icon: "remove", class:"danger"}
    ])
    .then((event)=>{
      switch(event) {
        case "complete":
          questLogic.toggleComplete(questId)
          closeModal()
          break;
        default:
          // throw new Error("Undefined event:", event);
      }
    })
  }
  removeElement(element) {
    element.parentElement.removeChild(element);
  }
  removeQuest(questId) {
    let index = this.getQuestIndex()
    this.removeElement(this.getQuestElem(questId))
    this.dailyQuestElems.splice(index, 1)
    this.dailyQuestIds.splice(index, 1)
  }
  addQuest(quest, bonus) {
    if (!bonus) {
      let questElem = this.buildQuest(quest.title, quest.categories[0], quest.points, quest.id, quest.completed)
      this.dailyQuestParent.appendChild(questElem);
      this.dailyQuestElems.push(questElem)
      this.dailyQuestIds.push(quest.id)
    }
  }
  buildQuest(title, subtitle, points, questId, completed, additionalClass) {
    let questCont = document.createElement("div")
    questCont.classList.add("quest")
    if (additionalClass) questCont.classList.add(additionalClass);
    if (completed) questCont.classList.add("completed");
    let checkboxCont = document.createElement("div")
      checkboxCont.classList.add("check-box")
      checkboxCont.innerHTML = `<svg viewBox="0 0 51 51"><path d="M25.5 0a25.5 25.5 0 100 51 25.5 25.5 0 000-51zm-1.77 37.38l-3.24 3.24-3.24-3.24-9.75-9.76 3.24-3.24 9.76 9.76 19.76-19.76 3.24 3.24-19.77 19.76z"/></svg><svg viewBox="0 0 55 55"><circle cx="27.5" cy="27.5" r="25.5" stroke-miterlimit="10" stroke-width="5"/></svg>`
      questCont.appendChild(checkboxCont)

      checkboxCont.addEventListener("click", (e)=>{
        e.stopPropagation();
        questLogic.toggleComplete(questId)
      }, true)

    let textCont = document.createElement("div")
      textCont.classList.add("text")
      let titleElem = document.createElement("p")
      titleElem.textContent = title;
      textCont.appendChild(titleElem);
      let subtitleElem = document.createElement("p")
      subtitleElem.textContent = subtitle;
      textCont.appendChild(subtitleElem)
      questCont.appendChild(textCont)
    let pointsCont = document.createElement("div")
      pointsCont.classList.add("points")
      let pointText = document.createElement("p")
      pointText.textContent = points;
      pointsCont.appendChild(pointText)
      pointsCont.appendChild(createSVG(ICONS.points.viewBox, ICONS.points.paths))
      questCont.appendChild(pointsCont)
    questCont.addEventListener("click", ()=>{
      this.showQuestModal(questId)
    })

    return questCont;
  }
  getQuestIndex(questId, bonus) {
    if (!bonus) {
      return this.dailyQuestIds.findIndex(id=>id===questId)
    }
  }
  getQuestElem(questId, bonus) {
    if (!bonus) {
      return this.dailyQuestElems[this.getQuestIndex(questId, bonus)]
    }
  }
  complete(questId, bonus) {
    this.getQuestElem(questId, bonus).classList.add("completed")
  }
  uncomplete(questId, bonus) {
    this.getQuestElem(questId, bonus).classList.remove("completed")
  }
}

class QuestLogic {
  constructor() {
    this.dailyQuests = [];
    this.bonusQuests = [];
    this.lastDate = null;
    this.excludedQuests = [];
    this.excludedCategories = [];
    this.disabledForToday = [];
    this.questPool = null;
    this.questDisplay = null;
    this.points = null;
    this.settings = {
      numberOfQuests: 3
    }
    this.afterPageLoad();
  }
  changePoints(delta) {
    let oldPoints = this.points;
    this.points += delta;
    this.questDisplay.changePoints(this.points);
    this.serializeData(["points"])
  }
  getCurrentDate() {
    let now = new Date();
    return `${now.getUTCFullYear()}-${String(now.getMonth()+1).padStart(2, 0)}-${String(now.getDate()).padStart(2, 0)}`;
  }
  getQuestIndex(questId, bonus) {
    return this.dailyQuests.findIndex(quest=>quest.id===questId)
  }
  getQuest(questId, bonus) {
    return this.dailyQuests.find(quest=>quest.id===questId)
  }
  toggleComplete(questId, bonus) {
    let index = this.getQuestIndex(questId);
    if (this.dailyQuests[index].completed) {
      this.changePoints(-1 * this.dailyQuests[index].points)
      this.questDisplay.uncomplete(questId);
      this.dailyQuests[index].completed = false
    }
    else {
      this.changePoints(this.dailyQuests[index].points)
      this.questDisplay.complete(questId);
      this.dailyQuests[index].completed = true
    }
    this.serializeData(["dailyQuests"])
  }
  continueDay() {
    this.deserializeData(["dailyQuests", "bonusQuests", "excludedQuests", "excludedCategories", "points"])
    this.disabledForToday = this.excludedQuests.concat(this.dailyQuests)
    this.questPool = new QuestPool(quests);
    this.questPool.buildWeightTable(this.disabledForToday, this.excludedCategories, {base: 10})
    this.dailyQuests.forEach(quest=>this.questDisplay.addQuest(quest))
  }
  checkBonusTasks(date) {
    // if (demoBirthdays[date]) {
    //   let birthday = demoBirthdays[date];
    //   bonusQuests.push(birthday);
    //
    // }
    // if (bonusEvents[date]) {
    //
    // }
  }
  newDay(skipData) {
    let now = new Date();
    let date = `${String(now.getMonth()+1).padStart(2, 0)}/${String(now.getDate()).padStart(2, 0)}`;
    this.checkBonusTasks(date);
    console.log(date)
    this.deserializeData(["excludedQuests", "excludedCategories", "points"])
    this.disabledForToday = this.excludedQuests;
    this.lastDate = this.getCurrentDate();
    localStorage.lastDate = this.lastDate
    this.questPool = new QuestPool(quests);
    this.questPool.buildWeightTable(this.disabledForToday, this.excludedCategories, {base: 10})
    for (let i = 0; i<this.settings.numberOfQuests; i++) {
      let quest = this.questPool.pull()
      if (quest) {
        this.dailyQuests.push({completed: false, ...quest})
        this.questDisplay.addQuest(quest, false);
      }
      else {
        // Quests ran out!
      }
    }
    this.serializeData(["dailyQuests"])
  }
  afterPageLoad() {
    this.questDisplay = new QuestDisplay("daily-quests", "bonus-quests", this)
    if (localStorage.dataPresent) {
      console.log(this.getCurrentDate() === localStorage.lastDate, this.getCurrentDate())
      if (this.getCurrentDate() === localStorage.lastDate) {
        this.continueDay();
      }
      else {
        this.newDay();
      }
      this.questDisplay.changePoints(this.points, true)
    }
    else {
      console.log("First Time!")
      this.firstDataGeneration();
    }
  }
  deserializeData(categories) {
    categories.forEach((category)=>{
      this[category] = JSON.parse(localStorage[category]);
    })
  }
  serializeData(categories) {
    categories.forEach((category)=>{
      localStorage[category] = JSON.stringify(this[category])
    })
  }
  firstDataGeneration() {
    // The first time the app is launched
    this.points = 0;
    this.serializeData(["dailyQuests", "bonusQuests", "excludedQuests", "excludedCategories", "points"])
    localStorage.dataPresent = true;
    this.newDay(true)
  }
}

// var questDisplay = new QuestDisplay("daily-quests", "bonus-quests");
var questLogic = new QuestLogic();
// switchPanes(1);
// document.getElementById("main").scrollLeft=500
