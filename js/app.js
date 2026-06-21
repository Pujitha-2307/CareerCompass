const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", () => {

    const name = document.getElementById("name").value;
    const career = document.getElementById("career").value;
    const level = document.getElementById("level").value;
    const hours = document.getElementById("hours").value;

    if (!name || !career || !level || !hours) {
        alert("Please fill all fields");
        return;
    }

    localStorage.setItem("name", name);
    localStorage.setItem("career", career);
    localStorage.setItem("level", level);
    localStorage.setItem("hours", hours);

    window.location.href = "roadmap.html";

});