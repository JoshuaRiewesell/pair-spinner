<template>
  <div>
    <div>
      <button @click="showPopup = true">&#9998;</button> <!-- Open the popup -->
      <button :class="{ used: rotationIdIsUsed }" @click="toggleUsedRotationId">{{ rotationId }}</button> <!-- Conditional class binding -->
      <button @click="shiftNames">&#8634;</button>
    </div>

    <!-- Popup for entering names -->
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
        <li v-for="(name, index) in secondHalfReversed" :key="index">
          {{ name }}
        </li>
      </ul>
      <ul>
        <li v-for="(name, index) in firstHalf" :key="index">
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
      names: ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve', 'Frank'],
      rotationId: 0,
      usedRotationIds: [],
      showPopup: false, // Control the popup visibility
      namesInput: '' // Model for the names input in the popup
    };
  },
  computed: {
    firstHalf() {
      return this.names.slice(0, Math.floor(this.names.length / 2));
    },
    secondHalfReversed() {
      const secondHalf = this.names.slice(Math.floor(this.names.length / 2));
      return secondHalf.reverse(); // Reverse the second half
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
        const lastItem = this.names.pop(); // Remove the last item
        this.names.splice(1, 0, lastItem); // Insert the last item at the second position
      }
      this.increaseRotationId();
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
        const secondHalfName = this.secondHalfReversed[i] || ''; // Handle cases where one list is longer
        const firstHalfName = this.firstHalf[i] || '';
        formattedText += `${secondHalfName} - ${firstHalfName}\n`;
      }

      // Copy the formatted string to clipboard
      navigator.clipboard.writeText(formattedText).then(() => {
        console.log('Copied to clipboard');
      });
    },
    submitNames() {
      this.names = this.namesInput.split(',').map(name => name.trim()).filter(name => name !== '');
      this.showPopup = false; // Close the popup after submitting
    }
  }
};
</script>

<style scoped>
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
}
button {
  margin: 20px 10px 10px 10px;
  padding: 5px 10px;
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
  background-color: red; /* Apply red color when used */
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
  width: 100%;
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