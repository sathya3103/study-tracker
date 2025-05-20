let data = JSON.parse(localStorage.getItem("studyData")) || {};

function saveData() {
  localStorage.setItem("studyData", JSON.stringify(data));
}

function addSubject() {
  const subjectName = prompt("Enter subject name:");
  if (subjectName && !data[subjectName.trim()]) {
    data[subjectName.trim()] = [];
    saveData();
    renderUnits();
  } else {
    alert("Invalid or duplicate subject name.");
  }
}

function addQuestion(subject) {
  const text = prompt("Enter question/unit:");
  if (text) {
    data[subject].push({ text, done: false });
    saveData();
    renderUnits();
  }
}

function toggleQuestion(subject, idx) {
  data[subject][idx].done = !data[subject][idx].done;
  saveData();
  renderUnits();
}

function renderUnits() {
  const container = document.getElementById("unitsContainer");
  container.innerHTML = "";

  Object.keys(data).forEach(subject => {
    const div = document.createElement("div");
    div.className = "subject";

    // Title with delete button
    const titleDiv = document.createElement("div");
    titleDiv.style.display = "flex";
    titleDiv.style.justifyContent = "space-between";
    titleDiv.style.alignItems = "center";

    const title = document.createElement("h3");
    title.innerText = subject;
    title.style.margin = "0";

    const deleteSubjectBtn = document.createElement("button");
    deleteSubjectBtn.textContent = "🗑️ Delete Subject";
    deleteSubjectBtn.onclick = () => {
      if (confirm(`Delete subject "${subject}"?`)) {
        delete data[subject];
        saveData();
        renderUnits();
      }
    };

    titleDiv.appendChild(title);
    titleDiv.appendChild(deleteSubjectBtn);

    // Add Question button
    const addQBtn = document.createElement("button");
    addQBtn.textContent = "+ Add Question";
    addQBtn.onclick = () => addQuestion(subject);

    // Questions container
    const questionsDiv = document.createElement("div");
    questionsDiv.className = "questions-container";

    data[subject].forEach((q, idx) => {
      const span = document.createElement("span");
      span.className = "question" + (q.done ? " completed" : "");
      span.innerText = q.text;

      span.onclick = () => toggleQuestion(subject, idx);
      span.oncontextmenu = (e) => {
        e.preventDefault();
        const newText = prompt("Rename question:", q.text);
        if (newText) {
          q.text = newText;
          saveData();
          renderUnits();
        }
      };

      questionsDiv.appendChild(span);
    });

    div.appendChild(titleDiv);
    div.appendChild(addQBtn);
    div.appendChild(questionsDiv);
    container.appendChild(div);
  });

  
}

renderUnits();
