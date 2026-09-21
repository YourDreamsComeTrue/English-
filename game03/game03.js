// بيانات الدرس والكلمات
const gameData = {
    // الكلمات الصحيحة للفراغات بالترتيب (من 1 إلى 15)
    correctAnswers: [
        "supplies",
        "backpack",
        "book",
        "notebook",
        "scissors",
        "glue",
        "pencil case",
        "tape",
        "backpack",
        "pencils",
        "pens",
        "eraser",
        "highlighter",
        "ruler",
        "color",
        "pencils"
    ],

    // الخيارات التي ستظهر للاعب في النافذة المنبثقة
    baseWordOptions: [
        "supplies", "backpack", "book", "notebook",
        "scissors", "glue", "tape", "pencil case",
        "pencils", "pens", "eraser", "highlighter",
        "ruler", "color", "pencils"
    ],

    // نص الفقرة الرئيسي مع الفراغات
    paragraphHTML: `
        School <span class="blank" data-index="0"></span><br><br>
        What's in your <span class="blank" data-index="1"></span>?<br>
        It's my <span class="blank" data-index="2"></span>. I can read.<br>
        It's my <span class="blank" data-index="3"></span>. I can write on it.<br>
        These are my <span class="blank" data-index="4"></span>. I can cut the paper.<br>
        It's my <span class="blank" data-index="5"></span>. I can stick them with it.<br>
        It's my <span class="blank" data-index="6"></span>. I can put them with it.<br>
        Is this your <span class="blank" data-index="7"></span>? Yes, it is.<br><br>
        What's in your <span class="blank" data-index="8"></span>?<br>
        These are my <span class="blank" data-index="9"></span> and <span class="blank" data-index="10"></span>. I like to write.<br>
        It's my <span class="blank" data-index="11"></span>. I can erase and write again.<br>
        It's my <span class="blank" data-index="12"></span>. I can mark with it.<br>
        It is my <span class="blank" data-index="13"></span>. I like to measure.<br>
        These are my <span class="blank" data-index="14"></span> <span class="blank" data-index="15"></span>. I can draw a rainbow.<br><br>
        There are things for school in my backpack.
    `
};
