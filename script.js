// Các phần tử DOM
var spinButton = document.getElementById("spin-button");
var spinCount = document.getElementById("spin-count");
var wheel = document.getElementById("wheel");

// Các phần thưởng
var prizes = [
  { name: "voucher 500k", probability: 0.1 },
  { name: "100K", probability: 0.2 },
  { name: "voucher 300k", probability: 0.2 },
  { name: "thêm lượt 1", probability: 0.3, bonus: 1 },
  { name: "50K", probability: 0.2 },
  { name: "voucher 100K", probability: 0.2 },
  { name: "thêm lượt 2", probability: 0.3, bonus: 2 },
  { name: "150K", probability: 0.2 },
];

var additionalSpins = 0; // Số lượt quay thêm
var bonusSpins = 0; // Số lượt quay bonus

// Khởi tạo
initialize();

// Hàm khởi tạo
function initialize() {
  additionalSpins = 5; // Đặt số lượt quay ban đầu là 2
  bonusSpins = 0; // Đặt số lượt quay bonus ban đầu là 0
  renderPercentageTable();
  updateSpinCount();
  updateBonus(bonusSpins); // Cập nhật giá trị hiển thị lượt quay bonus
}

// Hàm render bảng tỉ lệ
function renderPercentageTable() {
  var percentageTable = document.getElementById("percentage-table");
  percentageTable.innerHTML = "";

  for (var i = 0; i < prizes.length; i++) {
    var prize = prizes[i];

    var row = document.createElement("div");
    row.classList.add("percentage-row");

    var prizeName = document.createElement("span");
    prizeName.textContent = prize.name;
    row.appendChild(prizeName);

    var percentageInput = document.createElement("input");
    percentageInput.type = "number";
    percentageInput.min = "0";
    percentageInput.max = "100";
    percentageInput.step = "1";
    percentageInput.value = (prize.probability * 100).toFixed(2);
    row.appendChild(percentageInput);

    percentageTable.appendChild(row);
  }
}

// Hàm cập nhật số lượt quay
function updateSpinCount() {
  spinCount.textContent = additionalSpins;
}

// Hàm quay vòng tròn
function spinWheel() {
  var random = Math.random();
  var cumulativeProbability = 0;

  for (var i = 0; i < prizes.length; i++) {
    cumulativeProbability += prizes[i].probability;

    if (random < cumulativeProbability) {
      var selectedPrize = prizes[i];

      if (selectedPrize.bonus) {
        bonusSpins += selectedPrize.bonus;
        updateSpinCount();
        updateBonus(selectedPrize.bonus);
      }

      return selectedPrize;
    }
  }

  return null;
}

// Hàm bắt đầu quay
function startSpinning() {
  if (additionalSpins + bonusSpins >= 1) {
    // Kiểm tra nếu có ít nhất 1 lượt quay (bao gồm cả lượt quay bonus)
    spinButton.disabled = true;
    if (additionalSpins >= 1) {
      additionalSpins -= 1; // Trừ 1 lượt quay
    } else {
      var remainingSpins = 1 - additionalSpins; // Số lượt quay cần thiết
      additionalSpins = bonusSpins; // Cộng dồn giá trị của bonusSpins vào additionalSpins
      updateBonus(0); // Cập nhật giá trị hiển thị lượt quay bonus thành 0 trên giao diện
      bonusSpins = 0; // Đặt lại giá trị của bonusSpins về 0
      additionalSpins -= remainingSpins; // Trừ đi số lượt quay cần thiết
    }
    updateSpinCount();
    startSpinningAnimation();
  } else {
    alert("Bạn không có đủ lượt quay!");
  }
}

// Hàm thực hiện một lượt quay
function spin() {
  // Lấy thời gian thực
  var currentTime = new Date().toLocaleTimeString();

  // Lấy phần tử tbody trong bảng
  var tableBody = document.getElementById("result-table-body");

  // Tạo một hàng mới trong tbody
  var row = document.createElement("tr");

  // Tạo các ô dữ liệu trong hàng
  var timeCell = document.createElement("td");
  var spinNumberCell = document.createElement("td");
  var prizeCell = document.createElement("td");

  // Gán giá trị cho các ô dữ liệu
  timeCell.textContent = currentTime;

  // Lấy số lần quay hiện tại từ số lượng hàng đã có trong tbody
  var currentSpin = tableBody.getElementsByTagName("tr").length + 1;
  spinNumberCell.textContent = "Lần quay thứ " + currentSpin;

  var result = spinWheel();

  prizeCell.textContent = result ? result.name : "Chúc bạn may mắn lần sau!";

  // Gắn các ô dữ liệu vào hàng
  row.appendChild(timeCell);
  row.appendChild(spinNumberCell);
  row.appendChild(prizeCell);

  // Gắn hàng vào tbody
  tableBody.appendChild(row);

  if (result) {
    var message = "Chúc mừng! Bạn đã quay trúng: " + result.name;

    if (result.bonus) {
      message += ". Bạn được thêm " + result.bonus + " lượt quay!";
      bonusSpins += result.bonus;
      updateSpinCount();
      updateBonus(bonusSpins);
    }

    alert(message);
  } else {
    alert("Chúc bạn may mắn lần sau!");
  }
  // Kiểm tra nếu không còn lượt quay, cộng dồn bonusSpins và reset giá trị
  if (additionalSpins <= 0) {
    additionalSpins += bonusSpins;
    bonusSpins = 0;
    updateSpinCount();
    updateBonus(bonusSpins);
  }
}

// Hàm cập nhật giá trị hiển thị lượt quay thêm
function updateBonus(bonusValue) {
  var bonusElement = document.getElementById("bonus-value");
  bonusElement.textContent = bonusValue;

  // Kiểm tra nếu giá trị bonusValue là 1, thì mới cộng dồn vào biến bonusSpins
  if (bonusValue === 1) {
    bonusSpins ++;
    updateSpinCount();
  }
}

// Hàm chạy hiệu ứng vòng tròn
function startSpinningAnimation() {
  var spinCount = 8; // Số lần quay vòng tròn
  var currentSpin = 0;
  var degree = 0; // Góc quay ban đầu
  var spinInterval = 500; // Thời gian giữa các lần quay (ms)

  var spinIntervalId = setInterval(function () {
    degree += 45; // Tăng góc quay lên 45 độ

    // Áp dụng hiệu ứng quay cho giao diện
    wheel.style.transform = "rotate(" + degree + "deg)";

    currentSpin++;

    if (currentSpin >= spinCount) {
      clearInterval(spinIntervalId);
      spinButton.disabled = false;
      spin();
    }
  }, spinInterval);
}
