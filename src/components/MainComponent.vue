<template>
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
      <ul>
        <li v-for="(name, index) in secondHalfReversed" :key="index" :style="getColorStyle(name)">
          {{ name }}
        </li>
      </ul>
      <ul>
        <li v-for="(name, index) in firstHalf" :key="index" :style="getColorStyle(name)">
          {{ name }}
        </li>
      </ul>
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
      names: ['Alexander', 'Benjamin', 'Charlotte', 'David', 'Emma', 'Friedrich', 'Gretchen', 'Hans', 'Isabelle', 'Jürgen', 'Klara', 'Lukas', 'Michaela', 'Nina', 'Oliver', 'Petra', 'Quirin', 'Rainer', 'Sabrina', 'Thomas', 'Ursula', 'Vera', 'Waldemar', 'Xenia', 'Yvonne', 'Zacharias', 'Anja', 'Brigitte', 'Christoph', 'Dieter', 'Eva', 'Franz', 'Gisela', 'Hannah', 'Ingrid', 'Jakob', 'Klaus', 'Lea', 'Martin', 'Nico', 'Olaf', 'Paula'],
      rotationId: 0,
      usedRotationIds: [],
      showPopup: false,
      namesInput: ''
    };
  },
  computed: {
    firstHalf() {
      return this.names.slice(0, Math.floor(this.names.length / 2));
    },
    secondHalfReversed() {
      const secondHalf = this.names.slice(Math.floor(this.names.length / 2));
      return secondHalf.reverse();
    },
    rotationIdIsUsed() {
      return this.usedRotationIds.includes(this.rotationId);
    }
  },
  methods: {
    increaseRotationId() {
      this.rotationId = (this.rotationId + 1) % (this.names.length - 1);
    },
    shiftNames() {
      if (this.names.length > 2) {
        const lastItem = this.names.pop();
        this.names.splice(1, 0, lastItem);
      }
      this.increaseRotationId();
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
    },
    copyToClipboard() {
      let formattedText = '';
      const maxLength = Math.max(this.firstHalf.length, this.secondHalfReversed.length);

      for (let i = 0; i < maxLength; i++) {
        const secondHalfName = this.secondHalfReversed[i] || '';
        const firstHalfName = this.firstHalf[i] || '';
        formattedText += `${secondHalfName} - ${firstHalfName}\n`;
      }

      navigator.clipboard.writeText(formattedText).then(() => {
        console.log('Copied to clipboard');
      });
    },
    submitNames() {
      this.names = this.namesInput.split(/[\s,]+/).map(name => name.trim()).filter(name => name !== '');
      this.usedRotationIds = [];
      this.showPopup = false;
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
  border: 1px solid #ddd;
  margin: 5px 2px;
  width: 100px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: white;
  text-align: center;
  font-weight: 600;
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
</style>
