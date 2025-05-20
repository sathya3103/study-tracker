let data = JSON.parse(localStorage.getItem("studyData")) || {};

function saveData() {
  localStorage.setItem("studyData", JSON.stringify(data));
}

function addSubject() {
  const subjectName = prompt("Enter subject name:");
  if (subjectName && !data[subjectName.trim()]) {
    data[subjectName.trim()] = {};
    saveData();
    renderData();
  } else {
    alert("Invalid or duplicate subject name.");
  }
}

function addUnit(subject) {
  const unitName = prompt("Enter unit name:");
  if (unitName && !data[subject][unitName.trim()]) {
    data[subject][unitName.trim()] = [];
    saveData();
    renderData();
  } else {
    alert("Invalid or duplicate unit name.");
  }
}

function addQuestion(subject, unit) {
  const text = prompt("Enter question/unit:");
  if (text) {
    data[subject][unit].push({ text, done: false });
    saveData();
    renderData();
  }
}

function toggleQuestion(subject, unit, idx) {
  data[subject][unit][idx].done = !data[subject][unit][idx].done;
  saveData();
  renderData();
}

function deleteSubject(subject) {
  if (confirm(`Delete subject "${subject}"?`)) {
    delete data[subject];
    saveData();
    renderData();
  }
}

function deleteUnit(subject, unit) {
  if (confirm(`Delete unit "${unit}"?`)) {
    delete data[subject][unit];
    saveData();
    renderData();
  }
}

function renderData() {
  const container = document.getElementById("unitsContainer");
  container.innerHTML = "";

  Object.keys(data).forEach(subject => {
    const subjectDiv = document.createElement("div");
    subjectDiv.className = "subject";

    const subjectHeader = document.createElement("div");
    subjectHeader.style.display = "flex";
    subjectHeader.style.justifyContent = "space-between";
    subjectHeader.style.alignItems = "center";

    const subjectTitle = document.createElement("h3");
    subjectTitle.innerText = subject;

    const deleteSubBtn = document.createElement("button");
    deleteSubBtn.textContent = "🗑️ Delete Subject";
    deleteSubBtn.onclick = () => deleteSubject(subject);

    subjectHeader.appendChild(subjectTitle);
    subjectHeader.appendChild(deleteSubBtn);

    const addUnitBtn = document.createElement("button");
    addUnitBtn.textContent = "➕ Add Unit";
    addUnitBtn.onclick = () => addUnit(subject);

    subjectDiv.appendChild(subjectHeader);
    subjectDiv.appendChild(addUnitBtn);

    Object.keys(data[subject]).forEach(unit => {
      const unitDiv = document.createElement("div");
      unitDiv.className = "unit";

      const unitHeader = document.createElement("div");
      unitHeader.style.display = "flex";
      unitHeader.style.justifyContent = "space-between";
      unitHeader.style.alignItems = "center";

      const unitTitle = document.createElement("h4");
      unitTitle.innerText = unit;

      const deleteUnitBtn = document.createElement("button");
      deleteUnitBtn.textContent = "🗑️ Delete Unit";
      deleteUnitBtn.onclick = () => deleteUnit(subject, unit);

      const addQuestionBtn = document.createElement("button");
      addQuestionBtn.textContent = "➕ Add Question";
      addQuestionBtn.onclick = () => addQuestion(subject, unit);

      unitHeader.appendChild(unitTitle);
      unitHeader.appendChild(deleteUnitBtn);
      unitHeader.appendChild(addQuestionBtn);

      unitDiv.appendChild(unitHeader);

      const questionsDiv = document.createElement("div");
      questionsDiv.className = "questions-container";

      data[subject][unit].forEach((question, idx) => {
        const questionSpan = document.createElement("span");
        questionSpan.className = "question" + (question.done ? " completed" : "");
        // Show only question number without question text
        questionSpan.innerText = question.text;

        questionSpan.onclick = () => toggleQuestion(subject, unit, idx);

        questionSpan.oncontextmenu = (e) => {
          e.preventDefault();
          const newText = prompt("Rename question:", question.text);
          if (newText) {
            data[subject][unit][idx].text = newText;
            saveData();
            renderData();
          }
        };

        questionsDiv.appendChild(questionSpan);
      });

      unitDiv.appendChild(questionsDiv);
      subjectDiv.appendChild(unitDiv);
    });

    container.appendChild(subjectDiv);
  });
}

renderData();
