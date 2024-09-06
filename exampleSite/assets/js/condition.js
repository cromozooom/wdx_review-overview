function conditionBuilder() {
  return {
    entities: [], // Loaded from JSON
    selectedConditions: [], // User-selected conditions

    loadJson() {
      // Replace with the actual path to your JSON file
      fetch("/conditionBuilder.json")
        .then((response) => response.json())
        .then((data) => {
          this.entities = data.entities;
        });
    },

    addCondition() {
      this.selectedConditions.push({
        entity: null,
        subEntity: null,
        attribute: null,
        value: null,
      });
    },

    removeCondition(index) {
      this.selectedConditions.splice(index, 1);
    },

    init() {
      this.loadJson();
    },
  };
}

document.addEventListener("alpine:init", () => {
  Alpine.data("conditionBuilder", conditionBuilder);
});
