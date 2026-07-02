// ===== محرك الأسطرلاب الزمني =====
class AstrolabeEngine {
    constructor() {
        this.TOTAL_DAYS = 18250000; // 50,000 سنة × 365 يوم
        this.currentDay = 0;
        this.isRunning = false;
        this.intervalId = null;
        this.speed = 50;
        
        // التواريخ الابتدائية
        this.solarDate = { year: 2033, month: 'أكتوبر', day: 5 };
        this.lunarDate = { year: 1455, month: 'شعبان', day: 11 };
        this.solarDayName = 'الأربعاء';
        this.lunarDayName = 'الخميس';
        
        // مرجع للعناصر DOM
        this.elements = {
            counter: document.getElementById('counterNumber'),
            progress: document.getElementById('progressFill'),
            solarDate: document.getElementById('solarDate'),
            lunarDate: document.getElementById('lunarDate'),
            solarDay: document.getElementById('solarDay'),
            lunarDay: document.getElementById('lunarDay'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue')
        };
        
        this.init();
    }
    
    init() {
        // تحديث واجهة البداية
        this.updateDisplay();
        
        // ربط حدث سرعة المحاكاة
        this.elements.speedSlider.addEventListener('input', (e) => {
            this.speed = parseInt(e.target.value);
            this.elements.speedValue.textContent = this.speed + 'x';
            
            // إعادة تشغيل المحرك إذا كان يعمل
            if (this.isRunning) {
                this.pause();
                this.start();
            }
        });
    }
    
    // تشغيل المحرك
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        const interval = Math.max(1, 100 - this.speed); // سرعة عكسية
        
        this.intervalId = setInterval(() => {
            if (this.currentDay < this.TOTAL_DAYS) {
                this.currentDay++;
                this.advanceTime();
                this.updateDisplay();
            } else {
                this.pause();
            }
        }, interval);
    }
    
    // إيقاف المحرك
    pause() {
        this.isRunning = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    // إعادة الضبط
    reset() {
        this.pause();
        this.currentDay = 0;
        this.updateDisplay();
    }
    
    // تقدم الزمن (محاكاة)
    advanceTime() {
        // كل 365 يوم = سنة شمسية
        // كل 354 يوم ≈ سنة قمرية
        
        // تحديث التاريخ الشمسي (كل 365 يوم)
        const solarAdvance = Math.floor(this.currentDay / 365);
        const solarRemainder = this.currentDay % 365;
        
        // تحديث التاريخ القمري (كل 354 يوم)
        const lunarAdvance = Math.floor(this.currentDay / 354);
        const lunarRemainder = this.currentDay % 354;
        
        // محاكاة بسيطة (في الواقع تحتاج معادلات فلكية دقيقة)
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                       'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        const lunarMonths = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 
                            'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 
                            'ذو القعدة', 'ذو الحجة'];
        
        // سنة شمسية أساسية (2033 + الإزاحة)
        const baseSolarYear = 2033;
        const solarYear = baseSolarYear + solarAdvance;
        const solarMonthIndex = Math.floor(solarRemainder / 30.4) % 12;
        const solarDay = (solarRemainder % 30) + 1;
        
        // سنة قمرية أساسية (1455 + الإزاحة)
        const baseLunarYear = 1455;
        const lunarYear = baseLunarYear + lunarAdvance;
        const lunarMonthIndex = Math.floor(lunarRemainder / 29.5) % 12;
        const lunarDay = (lunarRemainder % 29) + 1;
        
        // تحديث الكائنات
        this.solarDate = {
            year: solarYear,
            month: months[solarMonthIndex] || 'أكتوبر',
            day: solarDay
        };
        
        this.lunarDate = {
            year: lunarYear,
            month: lunarMonths[lunarMonthIndex] || 'شعبان',
            day: lunarDay
        };
        
        // أسماء الأيام (محاكاة)
        const dayNames = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const dayIndex = this.currentDay % 7;
        this.solarDayName = dayNames[dayIndex];
        this.lunarDayName = dayNames[(dayIndex + 2) % 7];
    }
    
    // تحديث العرض
    updateDisplay() {
        // تحديث العداد
        this.elements.counter.textContent = this.currentDay.toLocaleString();
        
        // تحديث شريط التقدم
        const progress = (this.currentDay / this.TOTAL_DAYS) * 100;
        this.elements.progress.style.width = Math.min(progress, 100) + '%';
        
        // تحديث التاريخ الشمسي
        this.elements.solarDate.innerHTML = `
            <span class="day">${this.solarDate.year}</span>
            <span class="month">${this.solarDate.month}</span>
            <span class="year">${this.solarDate.day}</span>
        `;
        this.elements.solarDay.textContent = this.solarDayName;
        
        // تحديث التاريخ القمري
        this.elements.lunarDate.innerHTML = `
            <span class="day">${this.lunarDate.year}</span>
            <span class="month">${this.lunarDate.month}</span>
            <span class="year">${this.lunarDate.day}</span>
        `;
        this.elements.lunarDay.textContent = this.lunarDayName;
        
        // تحديث عنوان الصفحة
        document.title = `الأسطرلاب الزمني | ${this.currentDay.toLocaleString()} يوم`;
    }
}

// ===== تهيئة المحرك =====
const engine = new AstrolabeEngine();

// ===== وظائف التحكم العامة =====
function startEngine() {
    engine.start();
}

function pauseEngine() {
    engine.pause();
}

function resetEngine() {
    engine.reset();
}

// ===== تأثير إضافي: تغيير لون العداد عند التقدم =====
document.addEventListener('DOMContentLoaded', () => {
    // إضافة وميض ذهبي للعداد عند التشغيل
    const counter = document.getElementById('counterNumber');
    const observer = new MutationObserver(() => {
        if (engine.isRunning) {
            counter.style.textShadow = '0 0 60px rgba(212, 175, 55, 0.4)';
        } else {
            counter.style.textShadow = '0 0 20px rgba(212, 175, 55, 0.1)';
        }
    });
    
    // مراقبة تغيير النص
    observer.observe(counter, { characterData: true, childList: true });
});
