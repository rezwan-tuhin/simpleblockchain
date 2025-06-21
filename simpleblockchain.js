const crypto = require('crypto');

class Block {
  constructor(transactions, previousHash) {
    this.timestamp = Date.now();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const data = this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(difficulty) {
    const target = Array(difficulty + 1).join('0');
    while (this.hash.substring(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(` Block mined: ${this.hash}`);
  }
}

class Blockchain {
  constructor(difficulty = 1) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = difficulty;
    this.pendingTransactions = [];
  }

  createGenesisBlock() {
    return new Block("Genesis Block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
  }

  mineBlock() {
    if (this.pendingTransactions.length === 0) {
      console.log("No transaction to mine.");
      return;
    }

    const newBlock = new Block(this.pendingTransactions, this.getLatestBlock().hash);
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);

    this.pendingTransactions = [];
  }

  isValidChain() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) {
        return false;
      }

      if (current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;
  }

  printChain() {
    console.log(JSON.stringify(this.chain, null, 2));
  }
}

module.exports = { Block, Blockchain };
