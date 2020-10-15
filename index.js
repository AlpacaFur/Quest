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
  },
  "globe": {
    viewBox: "0 0 67.89 67.89",
    paths: [
      "M48.75 40.73c.27-2.24.48-4.48.48-6.79 0-2.31-.2-4.55-.48-6.79h11.47c.54 2.17.88 4.45.88 6.79s-.34 4.62-.88 6.79M42.74 59.61a52.73 52.73 0 004.68-12.08h10.01a27.23 27.23 0 01-14.69 12.08m-.85-18.88H26a44.96 44.96 0 01-.54-6.79c0-2.31.2-4.58.54-6.79h15.89c.31 2.21.54 4.48.54 6.79 0 2.31-.24 4.55-.54 6.79m-7.94 20.24a45.92 45.92 0 01-6.48-13.44h12.97a46.58 46.58 0 01-6.49 13.44m-13.58-40.6h-9.91A26.87 26.87 0 0125.12 8.29a58.06 58.06 0 00-4.75 12.08m-9.91 27.15h9.91a58.84 58.84 0 004.75 12.08 27.08 27.08 0 01-14.66-12.08m-2.79-6.79a28.14 28.14 0 01-.88-6.79c0-2.34.34-4.62.88-6.79h11.47a56.36 56.36 0 00-.48 6.79c0 2.31.2 4.55.48 6.79M33.95 6.89a46.02 46.02 0 016.48 13.48H27.46a46.05 46.05 0 016.49-13.48m23.49 13.48H47.42a53.48 53.48 0 00-4.68-12.08 27.07 27.07 0 0114.7 12.08M33.95 0a33.95 33.95 0 100 67.9 33.95 33.95 0 000-67.9z"
    ]
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
document.getElementById("newDay").addEventListener("click", ()=>{
  localStorage.lastDate = "0"
  window.location.reload();
})
// document.getElementById("add-quest").addEventListener("click", ()=>{
//   showQuests();
// })

document.addEventListener("touchstart", function(){}, true);

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

const quests = {
  "learn-word": {
    id: "learn-word",
    title: "Learn a new word!",
    summary: "Expand your vocabulary and learn a new word!",
    points: 5,
    resources: [
      {
        title: "Word of the Day",
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
        title: "I'm social distancing",
        action: "remove-category",
        category: "social"
      }
    ],
    categories: ["social"]
  },
  "start-book": {
    id: "start-book",
    title: "Start Reading a Book",
    points: 20,
    recurringQuest: "continue-book",
    summary: "Start reading a new book!",
    categories: ["learning"]
  },
  "continue-book": {
    id: "continue-book",
    title: "Continue Reading",
    points: 10,
    recurs: true,
    recurParent: "start-book",
    prompt: "Did you finish your book?",
    summary: "Keep reading your book!",
    categories: ["learning"]
  },
  "write-short-story": {
    id: "write-short-story",
    title: "Write a Short Story",
    points: 50,
    summary: "Write a short story about a topic of your choice. It can be anywhere from a few words to a few paragraphs. If you're looking for inspiration check out these writing prompts:",
    categories: ["learning"],
    resources: [
      {
        title: "Story Prompts",
        url: "https://www.writingexercises.co.uk/",
        simple_url: "writingexercises.co.uk"
      }
    ]
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
        action: "remove-category",
        category: "physical"
      }
    ]
  },
  "take-hike": {
    id: "take-hike",
    title: "Go on a Hike",
    points: 25,
    summary: "Go on a hike, whether nearby or farther away!",
    categories: ["physical"],
    hide: [
      {
        title: "There aren't any hiking locations nearby",
        action: "hide-and-replace",
        to: "take-walk"
      },
      {
        title: "I have limited mobility",
        action: "remove-category",
        category: "physical"
      }
    ]
  }
}

const demoBirthdays = {
  "10/10": "Test Person",
  "10/12": "Joe"
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
    categories: ["event"]
  },
  "10/12": {
    id: "register-to-vote",
    title: "Register to Vote!",
    summary: "Make sure you're registered to vote in this year's election! Request a mail-in ballot if you plan to vote by mail.",
    points: 50,
    resources: [
      {
        title: "Vote.gov",
        simple_url: "vote.gov",
        url: "https://vote.gov"
      }
    ],
    categories: ["event"]
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
      if (isNotCategoryExcluded && !quest.recurs) {
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
  riggedPull(questId) {
    let index = this.weightTable.findIndex(entry=>entry[1]===questId);
    if (index !== -1) {
      let id = this.weightTable[index][1];
      this.currentTableSum -= this.weightTable[index][0];
      this.weightTable.splice(index, 1)
      this.pulledQuests.push(id);
      return true;
    }
    else return false;
  }
}

class QuestDisplay {
  constructor(mainQuestElemId, bonusQuestElemId, logic) {
    this.dailyQuestElems = [];
    this.dailyQuestIds = [];
    this.bonusQuestElems = [];
    this.bonusQuestIds = [];
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

    document.getElementById("closeInfoPane").addEventListener("click", ()=>{
      this.hideInfoModal();
    })
    let paneBackground = document.getElementById("infoPaneBackground")
    paneBackground.addEventListener("click", (e)=>{
      if (e.target === paneBackground) this.hideInfoModal();
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

  switchPanes(paneIndex) {
    if (paneIndex === this.currentPane) return;
    if (this.currentPane !== -1) {
      document.getElementById(this.navList[this.currentPane]).classList.remove("active");
    }
    document.getElementById("main").scrollLeft=window.innerWidth*paneIndex;
    document.getElementById(this.navList[paneIndex]).classList.add("active");
    this.currentPane = paneIndex;
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

  checkBonusQuestVisibility() {
    if (this.bonusQuestIds.length === 0) {
      document.getElementById("bonus-title").classList.remove("visible")
    }
    else {
      document.getElementById("bonus-title").classList.add("visible")
    }
  }

  showInfoModal(questId, bonus) {
    let quest = this.logic.getQuest(questId, bonus);
    document.getElementById("infoPaneTitle").textContent = quest.title;
    document.getElementById("infoPaneCategory").textContent = this.capitalize(quest.categories[0]);
    document.getElementById("infoPaneText").textContent = quest.summary;
    let resourcesElem = document.getElementById("infoPaneLinks")
    while (resourcesElem.lastChild) {
      resourcesElem.removeChild(resourcesElem.firstChild)
    }
    if (quest.resources) {
      let frag = document.createDocumentFragment();
      console.log(quest.resources)
      quest.resources.forEach((resource)=>{
        let cont = document.createElement("a");
        cont.setAttribute("href", resource.url)
        cont.setAttribute("target", "__blank")
        cont.appendChild(createSVG(ICONS.globe.viewBox, ICONS.globe.paths))
        let textCont = document.createElement("div");
        let titleElem = document.createElement("p");
        titleElem.classList.add("title");
        titleElem.textContent = resource.title;
        textCont.appendChild(titleElem);
        let urlElem = document.createElement("p");
        urlElem.classList.add("url");
        urlElem.textContent = resource.simple_url;
        textCont.appendChild(urlElem);
        cont.appendChild(textCont)
        frag.appendChild(cont);
      })
      resourcesElem.appendChild(frag)
    }
    document.getElementById("infoPaneBackground").classList.add("visible")
  }
  hideInfoModal() {
    document.getElementById("infoPaneBackground").classList.remove("visible")
  }

  parseCustomHideChoice(questId, bonus, option) {
    let quest = this.logic.getQuest(questId, bonus)
    if (option.action === "remove-category") {
      this.showQuestionModal({
        title: `Would you like to hide ${quest.categories[0]} quests?`,
        choices: [
          {id:"yes", text: "Yes", class:"danger"},
          {id:"no", text: "No, only hide this quest", class:"danger"},
          {id:"cancel", text: "Cancel", class:"bold"}
        ]
      }).then((choice)=>{
        if (choice === "yes") {
          this.logic.removeQuest(questId, bonus)
          this.removeQuest(questId, bonus)
          this.logic.hideCategory(quest.categories[0])
          this.hideQuestionModal();
        }
        else if (choice === "no") {
          this.logic.removeQuest(questId, bonus)
          this.removeQuest(questId, bonus)
          this.hideQuestionModal();
        }
        else if (choice === "cancel") {
          this.hideQuestionModal();
        }
      })
    }
    else if (option.action === "hide-and-replace") {
      this.logic.removeQuest(questId, bonus)
      this.removeQuest(questId, bonus)
      this.logic.addQuestWithId(option.to, bonus)
      // replace with take a walk
    }
  }

  showHideModal(questId, bonus) {
    let quest = this.logic.getQuest(questId, bonus);
    if (quest.hide) {
      let extraChoices = quest.hide.map((choice, index)=>{
        return {id: "custom"+index, index: index, text: choice.title, class: "danger"};
      })
      this.showQuestionModal({
        title: "Why are you hiding this quest?",
        choices: [
          ...extraChoices,
          {id:"other", text: "Other Reason", class:"danger"},
          {id:"close", text: "Cancel", class:"bold"}
        ]
      }).then((result)=>{
        if (result === "close") {
          this.hideQuestionModal();
        }
        else if (result === "other") {
          // Hide Quest!
          this.removeQuest(questId, bonus)
          this.hideQuestionModal();
        }
        else if (result.startsWith("custom")) {
          this.hideQuestionModal();
          this.parseCustomHideChoice(questId, bonus, quest.hide[result.slice(6)])
        }
      })
    }
    else {
      this.showQuestionModal({
        title: "Hide this quest?",
        choices: [
          {id:"yes", text: "Yes", class:"danger"},
          {id:"no", text: "No"},
        ]
      }).then((result)=>{
        if (result === "no") {
          this.hideQuestionModal();
        }
        else if (result === "yes") {
          // Hide Quest!
          this.logic.removeQuest(questId, bonus)
          this.removeQuest(questId, bonus)
          this.hideQuestionModal();
        }
      })
    }
  }

  closeModal() {
    document.getElementById("modal-background").classList.add("hidden");
  }
  showQuestModal(questId, bonus) {
    let quest = this.logic.getQuest(questId, bonus)
    let completePhrase = quest.completed ? "Uncomplete Quest" : "Complete Quest!"
    this.setModal([
      {id:"complete", text:completePhrase, class:"complete", icon: "complete"},
      {id:"info", text:"More Info...", icon: "info"},
      {id:"hide", text:"Hide Quest...", icon: "remove", class:"danger"}
    ])
    .then((event)=>{
      switch(event) {
        case "complete":
          questLogic.toggleComplete(questId, bonus)
          this.closeModal()
          break;
        case "hide":
          this.showHideModal(questId, bonus)
          this.closeModal()
          break;
        case "info":
          this.showInfoModal(questId, bonus)
          this.closeModal()
          break;
        default:
          break;
      }
    })
  }

  showQuestionModal(questionObj) {
    return new Promise((resolve, reject)=>{
      let question = document.getElementById("question")
      while (question.firstChild) {
        question.removeChild(question.lastChild);
      }
      let questionTitle = document.createElement("p");
      questionTitle.textContent = questionObj.title;
      question.appendChild(questionTitle)
      let choicesDiv = document.createElement("div");
      questionObj.choices.forEach((choice)=>{
        let p = document.createElement("p");
        p.textContent = choice.text;
        if (choice.class) p.classList.add(choice.class)
        p.addEventListener("click", ()=>{
          resolve(choice.id)
        })
        choicesDiv.appendChild(p);
      })
      question.appendChild(choicesDiv)
      document.getElementById("questionBackground").classList.add("visible");
    })
  }
  hideQuestionModal() {
    document.getElementById("questionBackground").classList.remove("visible");
  }

  removeElement(element) {
    element.parentElement.removeChild(element);
  }
  removeQuest(questId, bonus) {
    if (!bonus) {
      let index = this.getQuestIndex(questId)
      this.removeElement(this.getQuestElem(questId))
      this.dailyQuestElems.splice(index, 1)
      this.dailyQuestIds.splice(index, 1)
    }
    else {
      let index = this.getQuestIndex(questId, true)
      this.removeElement(this.getQuestElem(questId, true))
      this.bonusQuestElems.splice(index, 1)
      this.bonusQuestIds.splice(index, 1)
      this.checkBonusQuestVisibility()
    }
  }

  capitalize(string) {
    return string.slice(0,1).toUpperCase() + string.slice(1)
  }

  addQuest(quest, bonus) {
    if (!bonus) {
      let questElem = this.buildQuest(quest.title, quest.categories[0], quest.points, quest.id, quest.completed, false, quest.recurs || !!quest.recurringQuest)
      this.dailyQuestParent.appendChild(questElem);
      this.dailyQuestElems.push(questElem)
      this.dailyQuestIds.push(quest.id)
    }
    else {
      let questElem = this.buildQuest(quest.title, quest.categories[0], quest.points, quest.id, quest.completed, true, quest.recurs || !!quest.recurringQuest)
      this.bonusQuestParent.appendChild(questElem)
      this.bonusQuestElems.push(questElem)
      this.bonusQuestIds.push(quest.id)
      this.checkBonusQuestVisibility()
    }
  }
  buildQuest(title, subtitle, points, questId, completed, bonus, recurs) {
    let questCont = document.createElement("div")
    questCont.classList.add("quest")
    if (bonus) questCont.classList.add("bonus");
    if (completed) questCont.classList.add("completed");
    let checkboxCont = document.createElement("div")
      checkboxCont.classList.add("check-box")
      checkboxCont.innerHTML = `<svg viewBox="0 0 51 51"><path d="M25.5 0a25.5 25.5 0 100 51 25.5 25.5 0 000-51zm-1.77 37.38l-3.24 3.24-3.24-3.24-9.75-9.76 3.24-3.24 9.76 9.76 19.76-19.76 3.24 3.24-19.77 19.76z"/></svg><svg viewBox="0 0 55 55"><circle cx="27.5" cy="27.5" r="25.5" stroke-miterlimit="10" stroke-width="5"/></svg>`
      questCont.appendChild(checkboxCont)

      checkboxCont.addEventListener("click", (e)=>{
        e.stopPropagation();
        questLogic.toggleComplete(questId, bonus)
      }, true)

    let textCont = document.createElement("div")
      textCont.classList.add("text")
      let titleElem = document.createElement("p")
      titleElem.textContent = title;
      textCont.appendChild(titleElem);
      let subtitleElem = document.createElement("p")
      subtitleElem.textContent = this.capitalize(subtitle) + (bonus ? " — Bonus" : "") + (recurs ? " — Recurring" : "");
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
      this.showQuestModal(questId, bonus)
    })

    return questCont;
  }

  getQuestIndex(questId, bonus) {
    if (!bonus) {
      return this.dailyQuestIds.findIndex(id=>id===questId)
    }
    else {
      return this.bonusQuestIds.findIndex(id=>id===questId)
    }
  }
  getQuestElem(questId, bonus) {
    if (!bonus) {
      return this.dailyQuestElems[this.getQuestIndex(questId)]
    }
    else {
      return this.bonusQuestElems[this.getQuestIndex(questId, true)]
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
    this.recurringQuests = [];
    this.excludedParents = [];
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
    if (bonus) {
      return this.bonusQuests.findIndex(quest=>quest.id===questId)
    }
    else {
      return this.dailyQuests.findIndex(quest=>quest.id===questId)
    }
  }
  getQuest(questId, bonus) {
    if (bonus) {
      return this.bonusQuests.find(quest=>quest.id===questId)
    }
    else {
      return this.dailyQuests.find(quest=>quest.id===questId)
    }
  }
  removeQuest(questId, bonus) {
    let quest = this.getQuest(questId, bonus)
    if (bonus) {
      let index = this.getQuestIndex(questId, true)
      this.bonusQuests.splice(index, 1)
      this.serializeData(["bonusQuests"])
    }
    else {
      let index = this.getQuestIndex(questId)
      this.dailyQuests.splice(index, 1)
      this.serializeData(["dailyQuests"])
    }
    if (quest.recurs) this.removeRecurringQuest(questId)
    else if (quest.recurringQuest && quest.completed) this.removeRecurringQuest(quest.recurringQuest)
    if (!this.excludedQuests.includes(questId)) this.excludedQuests.push(questId);
    this.serializeData(["excludedQuests"])
  }
  hideCategory(category) {
    if (!this.excludedCategories.includes(category)) this.excludedCategories.push(category);
    this.serializeData(["excludedCategories"])
  }
  updateWeightTable() {
    this.questPool.buildWeightTable(this.dailyQuests.concat(this.excludedQuests), this.excludedCategories, {base: 10})
  }

  addQuestWithId(questId) {
    let questAvailible = this.questPool.riggedPull(questId);
    if (questAvailible) {
      this.dailyQuests.push({completed: false, ...quests[questId]})
      this.questDisplay.addQuest(quests[questId]);
    }
  }

  toggleComplete(questId, bonus) {
    let index = this.getQuestIndex(questId, bonus);
    let questArray = bonus ? "bonusQuests" : "dailyQuests";
    let quest = this[questArray][index]
    if (quest.completed) {
      this.changePoints(-1 * quest.points)
      this.questDisplay.uncomplete(questId, bonus);
      quest.completed = false
      if (quest.recurringQuest) {
        this.removeRecurringQuest(quest.recurringQuest)
      }
    }
    else {
      this.changePoints(quest.points)
      this.questDisplay.complete(questId, bonus);
      quest.completed = true;
      if (quest.recurringQuest) {
        this.recurringQuests.push(quests[quest.recurringQuest])
        this.excludedParents.push(quest.id)
        this.serializeData(["recurringQuests", "excludedParents"])
      }
      else if (quest.recurs) {
        this.questDisplay.showQuestionModal({
          title: quest.prompt,
          choices: [
            {id: "yes", text: "Yes"},
            {id: "no", text: "No"},
          ]
        }).then((result)=>{
          if (result === "yes") {
            this.removeRecurringQuest(quest.id)
          }
          this.questDisplay.hideQuestionModal();
        })
      }
    }
    this.serializeData([questArray])
  }
  removeRecurringQuest(questId) {
    let questIndex = this.recurringQuests.findIndex(quest=>quest.id===questId);
    this.recurringQuests.splice(questIndex, 1)
    let parentId = quests[questId].recurParent
    let parentIndex = this.excludedParents.findIndex(id=>id===parentId);
    this.excludedParents.splice(parentIndex, 1)
    this.serializeData(["recurringQuests", "excludedParents"])
  }
  continueDay() {
    this.deserializeData(["dailyQuests", "bonusQuests", "excludedQuests", "excludedCategories", "points", "excludedParents"])
    this.disabledForToday = this.excludedQuests.concat(this.dailyQuests, this.excludedParents)
    this.questPool = new QuestPool(quests);
    this.questPool.buildWeightTable(this.disabledForToday, this.excludedCategories, {base: 10})
    this.dailyQuests.forEach(quest=>this.questDisplay.addQuest(quest))
    this.bonusQuests.forEach(quest=>this.questDisplay.addQuest(quest, true))
  }
  checkBonusTasks(date) {
    if (demoBirthdays[date] && !this.excludedQuests.includes("birthday")) {
      let birthdayName = demoBirthdays[date];
      let quest = {
        id: "birthday",
        title: `${birthdayName}'s birthday!`,
        points: 10,
        summary: `Wish ${birthdayName} a happy birthday!`,
        categories: ["event"]
      }
      this.bonusQuests.push({completed: false, bonus: true, ...quest})
      this.questDisplay.addQuest(quest, true)
    }
    if (bonusEvents[date] && !this.excludedQuests.includes(bonusEvents[date].id)) {
      let quest = bonusEvents[date];
      this.bonusQuests.push({completed: false, bonus: true, ...quest})
      this.questDisplay.addQuest(quest, true)
    }
    this.serializeData(["bonusQuests"])
  }
  newDay(skipData) {
    let now = new Date();
    let date = `${String(now.getMonth()+1).padStart(2, 0)}/${String(now.getDate()).padStart(2, 0)}`;
    console.log(date)
    this.deserializeData(["excludedQuests", "excludedCategories", "points", "recurringQuests", "excludedParents"])
    this.checkBonusTasks(date);
    this.disabledForToday = this.excludedQuests.concat(this.excludedParents);
    this.lastDate = this.getCurrentDate();
    localStorage.lastDate = this.lastDate
    this.questPool = new QuestPool(quests);
    this.questPool.buildWeightTable(this.disabledForToday, this.excludedCategories, {base: 10})
    for (let i = 0; i<this.settings.numberOfQuests; i++) {
      let quest;
      if (this.recurringQuests[i]) {
        quest = this.recurringQuests[i]
      }
      else {
        quest = this.questPool.pull()
      }
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
    this.serializeData(["dailyQuests", "bonusQuests", "excludedQuests", "excludedCategories", "points", "recurringQuests", "excludedParents"])
    localStorage.dataPresent = true;
    this.newDay(true)
  }
}

// var questDisplay = new QuestDisplay("daily-quests", "bonus-quests");
var questLogic = new QuestLogic();
// questLogic.questDisplay.showQuestionModal({
//   title: "Did you finish the book?",
//   choices: [
//     {id:"yes", text: "Yes"},
//     {id:"no", text: "No"},
//   ]
// }).then((res)=>{
//   if (res==="yes") console.log("AYY")
// })
// switchPanes(1);
// document.getElementById("main").scrollLeft=500
