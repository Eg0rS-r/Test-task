$(document).ready(function () {
  var id = $(".to-card").attr('href'),
    top = $(id).offset().top,
    bottom = $(id).height();
  bottom = top + bottom;

  $(".to-card").on("click", function (event) {
    event.preventDefault();
    $('body,html').animate({ scrollTop: top + 10 }, 1000);
  });

  var element = $('.to-card--hide');
  $(window).scroll(function () {
    var scroll = $('body, html').scrollTop();
    if ((scroll >= top - 10) && (scroll < bottom - 300)) {
      $('.to-card--hide').css("bottom", "-100px");
    } else {
      $('.to-card--hide').css("bottom", "0px");
    }
  });


  function amountValue() {
    $("#amount-value").html($("#amount").val().replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ') + " ₽");
    $("#amount-prog").css("width", $("#amount").val() / $("#amount").attr('max') * 100 + "%");
  }

  amountValue()
  $("#amount").on('input', () => {
    amountValue()
  });

  function durValue() {
    $("#dur-value").html($("#duration").val() + " мес.");
    $("#dur-prog").css("width", ($("#duration").val() - $("#duration").attr('min')) / ($("#duration").attr('max') - $("#duration").attr('min')) * 100 + "%");
  }

  durValue()
  $("#duration").on('input', () => {
    durValue()
  });


  const right = document.querySelector(".control--right");
  const left = document.querySelector(".control--left");
  const list = document.querySelector(".slider__list");
  var elemCount = $('.slider__list > li').length,
    step = $(document).width() <= 360 ? 220 : 242;
  var stepAdapt = $(slider__view).width() / $(".slider__list > li")
  console.log(stepAdapt)

  function changeSlideRight() {
    var rightSp = $(".slider__list").css('right');
    rightSp = parseInt(rightSp, 10);
    if ($(document).width() <= 360) {
      if (elemCount == $('.slider__list > li').length) {
        list.style.right = 160 + "px";
        elemCount -= 1
      } else if (elemCount == 1) {
        list.style.right = "0px";
        elemCount = $('.slider__list > li').length;
      } else if (elemCount == 2) {
        list.style.right = rightSp + 160 + "px";
        elemCount -= 1
      } else {
        list.style.right = rightSp + step + "px";
        elemCount -= 1;
      }
    } else {
      if (elemCount % 4 != 0) {
        list.style.right = rightSp + step + "px";
        elemCount -= 1;
      } else {
        list.style.right = "0px";
        elemCount = $('.slider__list > li').length;
      }
    }

  }

  right.addEventListener("click", function (event) {
    event.preventDefault();
    changeSlideRight();
  });

  function changeSlideLeft() {
    var rightSp = $(".slider__list").css('right');
    rightSp = parseInt(rightSp, 10);

    if ($(document).width() <= 360) {
      if (elemCount == $('.slider__list > li').length) {
        list.style.right = step * (elemCount - 3) + 320 + "px";
        elemCount = 1;
      } else if (elemCount == 1 || elemCount == $('.slider__list > li').length - 1) {
        list.style.right = rightSp - 160 + "px";
        elemCount += 1;
      } else {
        list.style.right = rightSp - step + "px";
        elemCount += 1;
      }
    } else {
      if (rightSp == 0) {
        list.style.right = rightSp + step * (elemCount % 4) + "px";
        elemCount = 4;
      } else {
        list.style.right = rightSp - step + "px";
        elemCount += 1;
      }
    }
  }

  left.addEventListener("click", function (event) {
    event.preventDefault();
    changeSlideLeft()
  });

  if ($(document).width() <= 360) {
    $(".slider__list").swipe({
      swipeLeft: () => {
        changeSlideRight();
        changeProgSlider();
      },
      threshold: 70
    });
    $(".slider__list").swipe({
      swipeRight: () => {
        changeSlideLeft();
        changeProgSlider();
      },
      threshold: 70
    });
  }


  var progList = $(".slider-prog__item").toArray(),
    elemCountPrev = 0;

  function changeProgSlider() {
    progList[elemCountPrev].classList.toggle("slider-prog__item--active");
    progList[$('.slider__list > li').length - elemCount].classList.toggle("slider-prog__item--active");
    elemCountPrev = $('.slider__list > li').length - elemCount;
  }

});