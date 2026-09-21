// بيانات الدرس والكلمات
const gameData = {
    // الكلمات الصحيحة للفراغات بالترتيب من 0 إلى 12 (إجمالي 13 فراغاً بدون تكرار)
    correctAnswers: [
        "supplies",
        "book",
        "notebook",
        "scissors",
        "glue",
        "tape",
        "pencil case",
        "pencils",
        "pens",
        "eraser",
        "highlighter",
        "ruler",
        "color pencils"
    ],

    // الخيارات الفريدة التي ستظهر للاعب في النافذة المنبثقة
    baseWordOptions: [
        "supplies",
        "book",
        "notebook",
        "scissors",
        "glue",
        "tape",
        "pencil case",
        "pencils",
        "pens",
        "eraser",
        "highlighter",
        "ruler",
        "color pencils"
    ],

    // نص الفقرة الرئيسي مدمج في 12 عبارة مرقمة
    paragraphHTML: `
        1. School <span class="blank" data-index="0"></span>.<br><br>
        2. It's my <span class="blank" data-index="1"></span>. I can read.<br><br>
        3. It's my <span class="blank" data-index="2"></span>. I can write on it.<br><br>
        4. These are my <span class="blank" data-index="3"></span>. I can cut the paper.<br><br>
        5. It's my <span class="blank" data-index="4"></span>. I can stick them with it.<br><br>
        6. It's my <span class="blank" data-index="5"></span>. I can put them with it.<br><br>
        7. Is this your <span class="blank" data-index="6"></span>? Yes, it is. What's in your pencil case?<br><br>
        8. These are my <span class="blank" data-index="7"></span> and <span class="blank" data-index="8"></span>. I like to write.<br><br>
        9. It's my <span class="blank" data-index="9"></span>. I can erase and write again.<br><br>
        10. It's my <span class="blank" data-index="10"></span>. I can mark with it.<br><br>
        11. It is my <span class="blank" data-index="11"></span>. I like to measure.<br><br>
        12. These are my <span class="blank" data-index="12"></span>. I can draw a rainbow.
    `
};
