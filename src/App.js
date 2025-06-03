import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Wallet,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Calendar,
  Filter,
  Lock,
  LogOut,
  User,
  PiggyBank,
  Target,
  Trash2,
} from "lucide-react";

const KostFinanceApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [savings, setSavings] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    type: "expense",
    category: "",
    amount: "",
    description: "",
    paymentMethod: "cash",
    date: new Date().toISOString().split("T")[0],
  });
  const [newSaving, setNewSaving] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    description: "",
    targetDate: "",
  });

  // Kredensial login untuk Arahma
  const VALID_CREDENTIALS = {
    username: "arahma",
    password: "arahma123",
  };

  // Categories untuk berbagai jenis transaksi
  const categories = {
    income: ["Uang Saku", "Gaji", "Part Time", "Freelance", "Bonus", "Lainnya"],
    expense: [
      "Makan",
      "Transport",
      "Sewa Kost",
      "Pulsa/Internet",
      "Laundry",
      "Hiburan",
      "Kuliah",
      "Kesehatan",
      "Belanja",
      "Lainnya",
    ],
  };

  // Load data dari state saat komponen dimount
  useEffect(() => {
    // Simulasi data tersimpan (dalam aplikasi nyata bisa dari backend/localStorage yang aman)
    const savedData = JSON.parse(
      localStorage.getItem("arahmaFinanceData") || "{}"
    );

    if (savedData.transactions) {
      setTransactions(savedData.transactions);
    }
    if (savedData.savings) {
      setSavings(savedData.savings);
    }
    if (savedData.showBalance !== undefined) {
      setShowBalance(savedData.showBalance);
    }
  }, []);

  // Save data setiap kali ada perubahan
  useEffect(() => {
    const dataToSave = {
      transactions,
      savings,
      showBalance,
    };
    localStorage.setItem("arahmaFinanceData", JSON.stringify(dataToSave));
  }, [transactions, savings, showBalance]);

  // Handle login
  const handleLogin = () => {
    if (
      loginForm.username === VALID_CREDENTIALS.username &&
      loginForm.password === VALID_CREDENTIALS.password
    ) {
      setIsLoggedIn(true);
      setLoginError("");
      setLoginForm({ username: "", password: "" });
    } else {
      setLoginError("Username atau password salah!");
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab("dashboard");
  };

  // Hitung total balance
  const calculateBalance = () => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === "income"
        ? total + transaction.amount
        : total - transaction.amount;
    }, 0);
  };

  // Hitung total cash dan m-banking
  const calculateByPaymentMethod = () => {
    const cash = transactions.reduce((total, t) => {
      if (t.paymentMethod === "cash") {
        return t.type === "income" ? total + t.amount : total - t.amount;
      }
      return total;
    }, 0);

    const mbanking = transactions.reduce((total, t) => {
      if (t.paymentMethod === "mbanking") {
        return t.type === "income" ? total + t.amount : total - t.amount;
      }
      return total;
    }, 0);

    return { cash, mbanking };
  };

  // Hitung total income dan expense bulan ini
  const getMonthlyStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const income = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense };
  };

  // Handle submit transaksi baru
  const handleSubmit = () => {
    if (!newTransaction.category || !newTransaction.amount) return;

    const transaction = {
      id: Date.now() + Math.random(),
      ...newTransaction,
      amount: parseFloat(newTransaction.amount),
      createdAt: new Date().toISOString(),
    };

    setTransactions((prev) => [transaction, ...prev]);
    setNewTransaction({
      type: "expense",
      category: "",
      amount: "",
      description: "",
      paymentMethod: "cash",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Handle submit tabungan baru
  const handleSavingSubmit = () => {
    if (!newSaving.name || !newSaving.targetAmount) return;

    const saving = {
      id: Date.now() + Math.random(),
      ...newSaving,
      targetAmount: parseFloat(newSaving.targetAmount),
      currentAmount: parseFloat(newSaving.currentAmount || 0),
      createdAt: new Date().toISOString(),
    };

    setSavings((prev) => [saving, ...prev]);
    setNewSaving({
      name: "",
      targetAmount: "",
      currentAmount: "",
      description: "",
      targetDate: "",
    });
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Delete saving
  const deleteSaving = (id) => {
    setSavings((prev) => prev.filter((s) => s.id !== id));
  };

  // Add money to saving
  const addMoneyToSaving = (savingId, amount) => {
    setSavings((prev) =>
      prev.map((saving) =>
        saving.id === savingId
          ? {
              ...saving,
              currentAmount: saving.currentAmount + parseFloat(amount),
            }
          : saving
      )
    );
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 text-center">
            <Lock className="mx-auto mb-4" size={48} />
            <h1 className="text-xl font-bold mb-2">🌸 Arahma's Finance</h1>
            <p className="text-sm opacity-90">Kelola keuangan dengan mudah</p>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Username
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    placeholder="Masukkan username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder="Masukkan password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                  />
                </div>
              </div>

              {loginError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {loginError}
                </div>
              )}

              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-200"
              >
                Masuk
              </button>
            </div>

            <div className="mt-6 p-4 bg-pink-50 rounded-lg">
              <h3 className="font-semibold text-sm mb-2">🌸Login Dulu ya...🌸:</h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const balance = calculateBalance();
  const { cash, mbanking } = calculateByPaymentMethod();
  const { income: monthlyIncome, expense: monthlyExpense } = getMonthlyStats();
  const totalSavings = savings.reduce((sum, s) => sum + s.currentAmount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100">
      <div className="max-w-md mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">🌸 Arahma's Finance</h1>
            <button
              onClick={handleLogout}
              className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>

          {/* Balance Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm opacity-90">Total Saldo</span>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/80 hover:text-white"
              >
                {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
            </div>
            <div className="text-2xl font-bold">
              {showBalance ? formatCurrency(balance) : "••••••••"}
            </div>
          </div>

          {/* Payment Method & Savings Breakdown */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Wallet size={14} />
                <span className="text-xs opacity-90">Cash</span>
              </div>
              <div className="font-semibold text-sm">
                {showBalance ? formatCurrency(cash) : "••••"}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard size={14} />
                <span className="text-xs opacity-90">M-Banking</span>
              </div>
              <div className="font-semibold text-sm">
                {showBalance ? formatCurrency(mbanking) : "••••"}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <PiggyBank size={14} />
                <span className="text-xs opacity-90">Tabungan</span>
              </div>
              <div className="font-semibold text-sm">
                {showBalance ? formatCurrency(totalSavings) : "••••"}
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="px-6 py-4 bg-pink-50">
          <h3 className="text-sm font-semibold text-gray-600 mb-3">
            Bulan Ini
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="text-green-600" size={16} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Pemasukan</div>
                <div className="font-semibold text-green-600">
                  {formatCurrency(monthlyIncome)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingDown className="text-red-600" size={16} />
              </div>
              <div>
                <div className="text-xs text-gray-500">Pengeluaran</div>
                <div className="font-semibold text-red-600">
                  {formatCurrency(monthlyExpense)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-gray-100">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "add", label: "Tambah" },
            { key: "savings", label: "Tabungan" },
            { key: "history", label: "Riwayat" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-3 px-2 text-xs font-medium ${
                activeTab === tab.key
                  ? "bg-white text-pink-600 border-b-2 border-pink-600"
                  : "text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 h-96 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div>
                <h3 className="font-semibold mb-3">Ringkasan Cepat</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-pink-50 p-3 rounded-lg">
                    <div className="text-xs text-pink-600 mb-1">
                      Transaksi Hari Ini
                    </div>
                    <div className="font-bold text-pink-700">
                      {
                        transactions.filter(
                          (t) =>
                            t.date === new Date().toISOString().split("T")[0]
                        ).length
                      }
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-xs text-purple-600 mb-1">
                      Total Transaksi
                    </div>
                    <div className="font-bold text-purple-700">
                      {transactions.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h3 className="font-semibold mb-3">Transaksi Terbaru</h3>
                <div className="space-y-2">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div>
                          <div className="font-medium text-sm">
                            {transaction.category}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.paymentMethod === "cash"
                              ? "Cash"
                              : "M-Banking"}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      Belum ada transaksi
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "add" && (
            <div className="space-y-4">
              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Jenis Transaksi
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewTransaction({ ...newTransaction, type: "income" })
                    }
                    className={`p-3 rounded-lg border-2 ${
                      newTransaction.type === "income"
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <TrendingUp className="mx-auto mb-1" size={20} />
                    <div className="text-sm font-medium">Pemasukan</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewTransaction({ ...newTransaction, type: "expense" })
                    }
                    className={`p-3 rounded-lg border-2 ${
                      newTransaction.type === "expense"
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <TrendingDown className="mx-auto mb-1" size={20} />
                    <div className="text-sm font-medium">Pengeluaran</div>
                  </button>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kategori
                </label>
                <select
                  value={newTransaction.category}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories[newTransaction.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-2">Jumlah</label>
                <input
                  type="number"
                  value={newTransaction.amount}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      amount: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewTransaction({
                        ...newTransaction,
                        paymentMethod: "cash",
                      })
                    }
                    className={`p-3 rounded-lg border-2 ${
                      newTransaction.paymentMethod === "cash"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <Wallet className="mx-auto mb-1" size={20} />
                    <div className="text-sm font-medium">Cash</div>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewTransaction({
                        ...newTransaction,
                        paymentMethod: "mbanking",
                      })
                    }
                    className={`p-3 rounded-lg border-2 ${
                      newTransaction.paymentMethod === "mbanking"
                        ? "border-pink-500 bg-pink-50 text-pink-700"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <CreditCard className="mx-auto mb-1" size={20} />
                    <div className="text-sm font-medium">M-Banking</div>
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      date: e.target.value,
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Keterangan (Opsional)
                </label>
                <input
                  type="text"
                  value={newTransaction.description}
                  onChange={(e) =>
                    setNewTransaction({
                      ...newTransaction,
                      description: e.target.value,
                    })
                  }
                  placeholder="Contoh: Makan siang di warung"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 px-4 rounded-lg font-medium hover:from-pink-600 hover:to-rose-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <PlusCircle size={20} />
                Tambah Transaksi
              </button>
            </div>
          )}

          {activeTab === "savings" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Tabungan Saya</h3>
                <div className="text-xs text-gray-500">
                  Total: {formatCurrency(totalSavings)}
                </div>
              </div>

              {/* Add New Saving */}
              <div className="bg-pink-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-pink-700">
                  Tambah Tabungan Baru
                </h4>

                <input
                  type="text"
                  value={newSaving.name}
                  onChange={(e) =>
                    setNewSaving({ ...newSaving, name: e.target.value })
                  }
                  placeholder="Nama tabungan (contoh: Liburan)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />

                <input
                  type="number"
                  value={newSaving.targetAmount}
                  onChange={(e) =>
                    setNewSaving({ ...newSaving, targetAmount: e.target.value })
                  }
                  placeholder="Target jumlah"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />

                <input
                  type="number"
                  value={newSaving.currentAmount}
                  onChange={(e) =>
                    setNewSaving({
                      ...newSaving,
                      currentAmount: e.target.value,
                    })
                  }
                  placeholder="Jumlah awal (opsional)"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />

                <input
                  type="date"
                  value={newSaving.targetDate}
                  onChange={(e) =>
                    setNewSaving({ ...newSaving, targetDate: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                />

                <button
                  onClick={handleSavingSubmit}
                  className="w-full bg-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-pink-600 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  <PiggyBank size={16} />
                  Buat Tabungan
                </button>
              </div>

              {/* Savings List */}
              <div className="space-y-3">
                {savings.map((saving) => {
                  const progress =
                    (saving.currentAmount / saving.targetAmount) * 100;
                  return (
                    <div key={saving.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{saving.name}</h4>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(saving.currentAmount)} /{" "}
                            {formatCurrency(saving.targetAmount)}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteSaving(saving.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        ></div>
                      </div>

                      <div className="text-xs text-gray-600 mb-2">
                        {progress.toFixed(1)}% tercapai
                        {saving.targetDate && (
                          <span className="ml-2">
                            • Target:{" "}
                            {new Date(saving.targetDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Tambah jumlah"
                          className="flex-1 p-2 border border-gray-300 rounded text-xs"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.target.value) {
                              addMoneyToSaving(saving.id, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input =
                              e.target.parentElement.querySelector("input");
                            if (input.value) {
                              addMoneyToSaving(saving.id, input.value);
                              input.value = "";
                            }
                          }}
                          className="bg-pink-500 text-white px-3 py-2 rounded text-xs hover:bg-pink-600 transition-colors"
                        >
                          Tambah
                        </button>
                      </div>
                    </div>
                  );
                })}
                {savings.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <PiggyBank className="mx-auto mb-2" size={48} />
                    <div>Belum ada tabungan</div>
                    <div className="text-xs mt-1">
                      Mulai buat tabungan pertama Anda!
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Riwayat Transaksi</h3>
                <div className="text-xs text-gray-500">
                  Total: {transactions.length} transaksi
                </div>
              </div>

              <div className="space-y-2">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-50 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <div className="font-medium">
                            {transaction.category}
                          </div>
                          {transaction.description && (
                            <div className="text-sm text-gray-500">
                              {transaction.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`font-bold ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </div>
                        <button
                          onClick={() => deleteTransaction(transaction.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        {transaction.paymentMethod === "cash" ? (
                          <>
                            <Wallet size={12} /> Cash
                          </>
                        ) : (
                          <>
                            <CreditCard size={12} /> M-Banking
                          </>
                        )}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(transaction.date).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="mb-2">📊</div>
                    <div>Belum ada riwayat transaksi</div>
                    <div className="text-xs mt-1">
                      Mulai tambahkan transaksi pertama Anda!
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KostFinanceApp;
