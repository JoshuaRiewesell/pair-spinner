<template>
  <div class="main-layout">
    <div class="left-sidebar">
      <h1>Zweierschaften</h1>
      <!-- Textfield that saves its value to localStorage on every update -->
      <textarea
        v-model="sidebarText"
        @input="saveSidebarText"
        placeholder="Bibelstelle..."
        :style="sidebarTextareaStyle"
        ref="sidebarTextarea"
        @mouseup="handleTextareaResize"
        @mouseleave="handleTextareaResize"
        rows="6"
      ></textarea>
    </div>
    <div class="center">
      <div>
        <button @click="showPopup = true">&#9998;</button>
        <button :class="{ used: rotationIdIsUsed }" @click="toggleUsedRotationId">{{ rotationId }}</button>
        <button @click="spin">&#8634;</button>
      </div>

      <div v-if="showPopup" class="popup" @click="showPopup = false">
        <div class="popup-content" @click="(e) => e.stopPropagation()">
          <h3>Namen</h3>
          <textarea v-model="namesInput" placeholder="Trenne die Namen mit Kommas und/oder Absätzen"></textarea>
          <div class="popup-buttons">
            <button @click="showPopup = false">X</button>
            <button @click="submitNames">&#10003;</button>
          </div>
        </div>
      </div>

      <div class="table">
        <div class="pair-list-row">
          <ul>
            <li v-for="(name, index) in splitNames[0]" :key="'l1-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
          <ul>
            <li v-for="(name, index) in splitNames[1]" :key="'l2-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
        </div>
        <div class="pair-list-row">
          <ul>
            <li v-for="(name, index) in splitNames[2]" :key="'l3-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
          <ul>
            <li v-for="(name, index) in splitNames[3]" :key="'l4-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
        </div>
        <div class="pair-list-row">
          <ul>
            <li v-for="(name, index) in splitNames[4]" :key="'l5-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
          <ul>
            <li v-for="(name, index) in splitNames[5]" :key="'l6-' + index" :style="getColorStyle(name)" v-html="formatName(name)"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      names: JSON.parse(localStorage.getItem('names')) || [],
      rotationId: 0,
      usedRotationIds: JSON.parse(localStorage.getItem('usedRotationIds')) || [],
      showPopup: false,
      namesInput: '',
      sidebarText: localStorage.getItem('sidebarText') || '',
      sidebarTextareaWidth: localStorage.getItem('sidebarTextareaWidth') || '96%',
      sidebarTextareaHeight: localStorage.getItem('sidebarTextareaHeight') || '120px',
    };
  },
  computed: {
    splitNames() {
      // Teilt die Namen in 6 möglichst gleich große Listen auf
      const result = [[], [], [], [], [], []];
      const baseSize = Math.floor(this.names.length / 6);
      let rest = this.names.length % 6;
      let idx = 0;
      let nameIdx = 0;
      for (let i = 0; i < 6; i++) {
        const size = baseSize + (rest > 0 ? 1 : 0);
        rest--;
        result[i] = this.names.slice(nameIdx, nameIdx + size);
        nameIdx += size;
      }
      return result;
    },
    rotationIdIsUsed() {
      return this.usedRotationIds.includes(this.rotationId);
    },
    sidebarTextareaStyle() {
      return {
        width: this.sidebarTextareaWidth,
        height: this.sidebarTextareaHeight,
        margin: '10px',
        padding: '12px',
        borderRadius: '6px',
        border: '1px solid #1a2233',
        fontSize: '22px',
        color: '#e0e6ed',
        background: '#101726',
        boxSizing: 'border-box',
        resize: 'both',
        textAlign: 'left',
        verticalAlign: 'top',
      };
    }
  },
  methods: {
    increaseRotationId() {
      this.rotationId = (this.rotationId + 1) % (this.names.length - 1);
      localStorage.setItem('rotationId', this.rotationId);
    },
    shiftNames() {
      if (this.names.length > 2) {
        const lastItem = this.names.pop();
        this.names.splice(1, 0, lastItem);
      }
      this.increaseRotationId();
      localStorage.setItem('rotationId', this.rotationId);
    },
    spin() {
      const rotations = Math.floor(Math.random() * this.names.length) + this.names.length;
      for (let i = 0; i < rotations; i++) {
        setTimeout(() => {
          this.shiftNames();
        }, (Math.pow(Math.tan((i/rotations)), 2) + Math.tan((i/rotations))) * 500);
      }
    },
    toggleUsedRotationId() {
      if (this.rotationIdIsUsed) {
        this.usedRotationIds = this.usedRotationIds.filter(id => id !== this.rotationId);
      } else {
        this.usedRotationIds.push(this.rotationId);
        this.copyToClipboard();
      }
      localStorage.setItem('usedRotationIds', JSON.stringify(this.usedRotationIds));
    },
    copyToClipboard() {
      let formattedText = '';
      const lists = this.splitNames;
      const maxLength = Math.max(
        lists[0].length,
        lists[1].length,
        lists[2].length,
        lists[3].length,
        lists[4].length,
        lists[5].length
      );
      for (let i = 0; i < maxLength; i++) {
        const p1 = `${lists[0][i] || ''} - ${lists[1][i] || ''}`;
        const p2 = `${lists[2][i] || ''} - ${lists[3][i] || ''}`;
        const p3 = `${lists[4][i] || ''} - ${lists[5][i] || ''}`;
        formattedText += `${p1}\t${p2}\t${p3}\n`;
      }
      navigator.clipboard.writeText(formattedText);
    },
    submitNames() {
      this.names = this.namesInput
        .split(/[\n,]+/)
        .map(name => name.trim())
        .filter(name => name !== '');
      this.usedRotationIds = [];
      this.rotationId = 0;
      localStorage.setItem('names', JSON.stringify(this.names));
      localStorage.setItem('usedRotationIds', JSON.stringify(this.usedRotationIds));
      localStorage.setItem('rotationId', this.rotationId);
      this.showPopup = false;
      // Nach dem Setzen: Namen entsprechend rotationId rotieren
      for (let i = 0; i < this.rotationId; i++) {
        if (this.names.length > 1) {
          const lastItem = this.names.pop();
          this.names.splice(1, 0, lastItem);
        }
      }
    },
    saveSidebarText() {
      localStorage.setItem('sidebarText', this.sidebarText);
    },
    handleTextareaResize() {
      this.$nextTick(() => {
        const el = this.$refs.sidebarTextarea;
        if (el) {
          const width = el.style.width || el.offsetWidth + 'px';
          const height = el.style.height || el.offsetHeight + 'px';
          this.sidebarTextareaWidth = width;
          this.sidebarTextareaHeight = height;
          localStorage.setItem('sidebarTextareaWidth', width);
          localStorage.setItem('sidebarTextareaHeight', height);
        }
      });
    },
    hashCode(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    },
    rgbFromHash(hash) {
      // Map the hash value to RGB values
      const r = (hash >> 16) & 0xAA;
      const g = (hash >> 8) & 0xAA;
      const b = hash & 0xAA;
      return `rgb(${r}, ${g}, ${b})`;
    },
    getColorStyle(name) {
      const hash = this.hashCode(name);
      const color = this.rgbFromHash(hash);
      return {
        backgroundColor: color
      };
    },
    formatName(name) {
      return name.replace(/ /g, '<br>');
    }
  },
  mounted() {
    // Ensure sidebarText is loaded from localStorage on mount (in case of reactivity issues)
    this.sidebarText = localStorage.getItem('sidebarText') || '';
    this.sidebarTextareaWidth = localStorage.getItem('sidebarTextareaWidth') || '96%';
    this.sidebarTextareaHeight = localStorage.getItem('sidebarTextareaHeight') || '120px';
    const storedRotationId = localStorage.getItem('rotationId');
    if (storedRotationId !== null) {
      this.rotationId = parseInt(storedRotationId, 10);
    }
    // Nach dem Laden: Namen entsprechend rotationId rotieren
    for (let i = 0; i < this.rotationId; i++) {
      if (this.names.length > 1) {
        const lastItem = this.names.pop();
        this.names.splice(1, 0, lastItem);
      }
    }
  }
};
</script>

<style scoped>
p, h1, h2, h3, ul, li {
  margin: 0;
  padding: 0;
  font-family: Arial, Helvetica, sans-serif;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  flex-direction: column;
}
li {
  padding: 10px;
  margin: 5px 5px;
  width: 120px;
  height: 50px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-overflow: ellipsis;
}
button {
  margin: 20px 10px 10px 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  font-size: 24px;
  line-height: 24px;
}
button:hover {
  background-color: #369870;
}
button.used {
  background-color: red;
}
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.table {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.popup-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
}
textarea {
  resize: none;
  width: calc(100% - 20px);
  height: 100px;
  margin: 10px 0;
  padding: 10px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
.popup-buttons button {
  margin: 5px;
}
.pair-list-row {
  display: flex;
  flex-direction: row;
  margin: 0 32px;
}
.main-layout {
  display: flex;
  flex-direction: row;
  height: 100vh;
  align-items: flex-start;
}
.left-sidebar {
  min-width: 180px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: 20px;
  height: auto;
  flex-shrink: 0;
  color: #e0e6ed;
}
.left-sidebar h1 {
  font-size: 2.5rem;
  font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
  color: #f5f6fa;
  margin: 0 0 14px 16px;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>

<style>
body {
  background: linear-gradient(135deg, #0a0f18 0%, #151c28 100%);
}
</style>
