const fs = require('fs');

/**
 * Класс для анализа транзакций
 */
class TransactionAnalyzer {
    /**
     * Конструктор класса
     * @param {Array} transactions - Массив транзакций
     */
    constructor(transactions) {
        this.transactions = transactions;
    }

    /**
     * Добавляет новую транзакцию
     * @param {Object} transaction - Объект транзакции
     */
    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    /**
     * Возвращает все транзакции
     * @returns {Array} - Массив всех транзакций
     */
    getAllTransactions() {
        return this.transactions;
    }

    /**
     * Рассчитывает общую сумму всех транзакций
     * @returns {number} - Общая сумма всех транзакций
     */
    calculateTotalAmount() {
        return this.transactions.reduce((total, tx) => total + parseFloat(tx.transaction_amount), 0);
    }

    /**
     * Рассчитывает общую сумму транзакций за указанный год, месяц и день
     * @param {number} [year] - Год
     * @param {number} [month] - Месяц
     * @param {number} [day] - День
     * @returns {number} - Общая сумма транзакций за указанный период
     */
    calculateTotalAmountByDate(year, month, day) {
        return this.transactions
            .filter(tx => {
                const date = new Date(tx.transaction_date);
                return (!year || date.getFullYear() === year) &&
                       (!month || date.getMonth() + 1 === month) &&
                       (!day || date.getDate() === day);
            })
            .reduce((total, tx) => total + parseFloat(tx.transaction_amount), 0);
    }

    /**
     * Возвращает транзакции указанного типа
     * @param {string} type - Тип транзакции
     * @returns {Array} - Массив транзакций указанного типа
     */
    getTransactionByType(type) {
        return this.transactions.filter(tx => tx.transaction_type === type);
    }

    /**
     * Возвращает транзакции в указанном диапазоне дат
     * @param {string} startDate - Начальная дата (в формате YYYY-MM-DD)
     * @param {string} endDate - Конечная дата (в формате YYYY-MM-DD)
     * @returns {Array} - Массив транзакций в указанном диапазоне дат
     */
    getTransactionsInDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.transactions.filter(tx => {
            const date = new Date(tx.transaction_date);
            return date >= start && date <= end;
        });
    }

    /**
     * Возвращает транзакции, совершенные с указанным торговым местом или компанией
     * @param {string} merchantName - Название торгового места или компании
     * @returns {Array} - Массив транзакций с указанным торговым местом или компанией
     */
    getTransactionsByMerchant(merchantName) {
        return this.transactions.filter(tx => tx.merchant_name === merchantName);
    }

    /**
     * Возвращает среднее значение транзакций
     * @returns {number} - Среднее значение транзакций
     */
    calculateAverageTransactionAmount() {
        if (this.transactions.length === 0) return 0;
        return this.calculateTotalAmount() / this.transactions.length;
    }

    /**
     * Возвращает транзакции с суммой в заданном диапазоне
     * @param {number} minAmount - Минимальная сумма
     * @param {number} maxAmount - Максимальная сумма
     * @returns {Array} - Массив транзакций с суммой в заданном диапазоне
     */
    getTransactionsByAmountRange(minAmount, maxAmount) {
        return this.transactions.filter(tx => {
            const amount = parseFloat(tx.transaction_amount);
            return amount >= minAmount && amount <= maxAmount;
        });
    }

    /**
     * Рассчитывает общую сумму дебетовых транзакций
     * @returns {number} - Общая сумма дебетовых транзакций
     */
    calculateTotalDebitAmount() {
        return this.getTransactionByType('debit')
            .reduce((total, tx) => total + parseFloat(tx.transaction_amount), 0);
    }

    /**
     * Возвращает каких транзакций больше всего (debit или credit)
     * @returns {string} - Тип транзакций, которых больше всего (debit, credit или equal)
     */
    mostTransactionTypes() {
        const debitCount = this.getTransactionByType('debit').length;
        const creditCount = this.getTransactionByType('credit').length;
        if (debitCount > creditCount) return 'debit';
        if (creditCount > debitCount) return 'credit';
        return 'equal';
    }

    /**
     * Возвращает транзакции, совершенные до указанной даты
     * @param {string} date - Дата (в формате YYYY-MM-DD)
     * @returns {Array} - Массив транзакций, совершенных до указанной даты
     */
    getTransactionsBeforeDate(date) {
        const targetDate = new Date(date);
        return this.transactions.filter(tx => new Date(tx.transaction_date) < targetDate);
    }

    /**
     * Возвращает транзакцию по её уникальному идентификатору
     * @param {string} id - Уникальный идентификатор транзакции
     * @returns {Object} - Транзакция с указанным идентификатором
     */
    findTransactionById(id) {
        return this.transactions.find(tx => tx.transaction_id === id);
    }

    /**
     * Возвращает новый массив, содержащий только описания транзакций
     * @returns {Array} - Массив описаний транзакций
     */
    mapTransactionDescriptions() {
        return this.transactions.map(tx => tx.transaction_description);
    }
}

// Пример использования
const rawTransactions = fs.readFileSync('transactions.json');
const transactions = JSON.parse(rawTransactions);

const analyzer = new TransactionAnalyzer(transactions);

console.log(analyzer.getAllTransactions());
console.log(analyzer.getUniqueTransactionType());
console.log(analyzer.calculateTotalAmount());
console.log(analyzer.calculateTotalAmountByDate(2024));
console.log(analyzer.getTransactionByType('debit'));
console.log(analyzer.getTransactionsInDateRange('2024-01-01', '2024-12-31'));
console.log(analyzer.getTransactionsByMerchant('SuperMart'));
console.log(analyzer.calculateAverageTransactionAmount());
console.log(analyzer.getTransactionsByAmountRange(50, 150));
console.log(analyzer.calculateTotalDebitAmount());
console.log(analyzer.findMostTransactionsMonth());
console.log(analyzer.findMostDebitTransactionMonth());
console.log(analyzer.mostTransactionTypes());