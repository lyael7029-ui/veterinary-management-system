// ===============================
// TABS VISUALES DEL EXPEDIENTE
// Marca la pestaña y sección activa
// ===============================

const recordTabs = document.querySelectorAll(".record-tab");
const recordSections = document.querySelectorAll(".record-section");

recordTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    recordTabs.forEach((item) => {
      item.classList.remove("record-tab-active");
    });

    recordSections.forEach((section) => {
      section.classList.remove("record-section-active");
    });

    tab.classList.add("record-tab-active");

    const sectionId = tab.getAttribute("href");
    const activeSection = document.querySelector(sectionId);

    if (activeSection) {
      activeSection.classList.add("record-section-active");
    }
  });
});