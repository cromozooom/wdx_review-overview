function profilerComponent() {
  return {
    profiler: [],
    currentSectionIndex: 0,
    tooltipContent: "",
    tooltipVisible: false,
    tooltipPosition: { x: 0, y: 0 },
    colors: [
      "rgb(94.014% -40.464% 45.116%)",
      "rgb(82.913% -38.105% 69.768%)",
      "rgb(70.948% -36.516% 92.841%)",
      "rgb(56.848% -35.148% 109.99%)",
      "rgb(39.138% -30.385% 118.31%)",
      "rgb(-1.5083% 16.507% 104.81%)",
      "rgb(-35.215% 26.759% 102.41%)",
      "rgb(-50.672% 51.733% 95.373%)",
      "rgb(-47.492% 51.645% 68.157%)",
      "rgb(-49.52% 59.78% 56.591%)",
      "rgb(-46.236% 69.413% 46.728%)",
      "rgb(-7.9117% 79.063% 33.542%)",
      "rgb(47.07% 80.881% 14.648%)",
      "rgb(74.144% 81.019% -21.888%)",
      "rgb(93.523% 77.995% -28.224%)",
      "rgb(106.9% 72.088% -26.164%)",
      "rgb(114.52% 64.949% -2.0043%)",
      "rgb(113.27% 55.164% 31.076%)",
      "rgb(100.04% 38.412% 38.473%)",
      "rgb(76.624% 27.657% 42.539%)",
    ],

    async loadData() {
      const storedProfiler = localStorage.getItem("profiler");
      const storedSectionIndex = localStorage.getItem("currentSectionIndex");

      if (storedProfiler) {
        this.profiler = JSON.parse(storedProfiler);
      } else {
        const response = await fetch("/profiler.json");
        const data = await response.json();
        this.profiler = data.form;
        this.saveProfilerToLocalStorage();
      }

      if (storedSectionIndex !== null) {
        this.currentSectionIndex = parseInt(storedSectionIndex, 10);
      }

      this.$nextTick(() => {
        this.scrollToSection(this.currentSectionIndex);
      });
    },

    saveProfilerToLocalStorage() {
      localStorage.setItem("profiler", JSON.stringify(this.profiler));
    },

    saveCurrentSectionToLocalStorage() {
      localStorage.setItem("currentSectionIndex", this.currentSectionIndex);
    },

    getCurrentSectionTitle(index) {
      return this.profiler[index] ? this.profiler[index].section : "";
    },

    getCurrentSectionCTA(index) {
      return this.profiler[index] ? this.profiler[index].cta : "";
    },

    scrollToSection(index) {
      if (index >= 0 && index < this.profiler.length) {
        this.currentSectionIndex = index;
        const sectionElement = document.getElementById(`section-${index}`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: "smooth" });
        }
        this.saveCurrentSectionToLocalStorage();
      }
    },

    nextSection() {
      if (this.currentSectionIndex < this.profiler.length - 1) {
        this.scrollToSection(this.currentSectionIndex + 1);
      }
    },

    previousSection() {
      if (this.currentSectionIndex > 0) {
        this.scrollToSection(this.currentSectionIndex - 1);
      }
    },

    getTotal(questions) {
      return questions.reduce(
        (total, question) => total + (question.value || 0),
        0
      );
    },

    drawPieChart(questions) {
      const total = this.getTotal(questions);
      let cumulativePercent = 0;
      const slices = questions.map((question, index) => {
        const value = question.value || 0;
        const percent = value / total;
        const startAngle = cumulativePercent * 2 * Math.PI;
        cumulativePercent += percent;
        const endAngle = cumulativePercent * 2 * Math.PI;
        const largeArcFlag = percent > 0.5 ? 1 : 0;
        const x1 = Math.cos(startAngle) * 100;
        const y1 = Math.sin(startAngle) * 100;
        const x2 = Math.cos(endAngle) * 100;
        const y2 = Math.sin(endAngle) * 100;

        const pathData = `
          M 0 0
          L ${x1} ${y1}
          A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}
          Z
        `;

        return `
          <path
            d="${pathData}"
            fill="${this.getRandomColor(index)}"
            @mouseover="showTooltip($event, '${question.label}', ${
          percent * 100
        })"
            @mousemove="updateTooltipPosition($event)"
            @mouseout="hideTooltip()"
          ></path>
        `;
      });

      return `
        <svg viewBox="-110 -110 220 220" width="580" height="580">
          ${slices.join("")}
        </svg>
      `;
    },

    getRandomColor(index) {
      return this.colors[index % this.colors.length];
    },

    showTooltip(event, label, percentage) {
      this.tooltipContent = `${label}: ${percentage.toFixed(2)}%`;
      this.tooltipVisible = true;
      this.updateTooltipPosition(event);
    },

    hideTooltip() {
      this.tooltipVisible = false;
    },

    updateTooltipPosition(event) {
      const xOffset = 10;
      const yOffset = 10;
      let x = event.clientX + xOffset;
      let y = event.clientY + yOffset;

      const quadrantX =
        event.clientX > window.innerWidth / 2 ? "right" : "left";
      const quadrantY =
        event.clientY > window.innerHeight / 2 ? "bottom" : "top";

      if (quadrantX === "right") {
        x = event.clientX - xOffset - 100; // Adjust width of tooltip
      }
      if (quadrantY === "bottom") {
        y = event.clientY - yOffset - 50; // Adjust height of tooltip
      }

      this.tooltipPosition = { x, y };
    },
  };
}
