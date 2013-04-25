describe("User Satisfaction Survey", function () {
  describe("Cookies", function () {
    var survey;
    var surveyElement;

    var clickElem = function (link) {
      var cancelled = false;

      if (document.createEvent) {
        var event = document.createEvent("MouseEvents");
        event.initMouseEvent("click", true, true, window,
                             0, 0, 0, 0, 0,
                             false, false, false, false,
                             0, null);
        cancelled = !link.dispatchEvent(event);
      } else if (link.fireEvent) {
        cancelled = !link.fireEvent("onclick");
      }

      if (!cancelled) {
        window.location = link.href;
      }
    }

    var block = '<div id="banner-notification" style="display: none"></div>\
    <div id="global-cookie-message" style="display: none"></div>\
    <div id="global-browser-prompt" style="display: none"></div>\
    <section id="user-satisfaction-survey">\
      <div class="wrapper">\
        <h1>Tell us what you think of GOV.UK</h1>\
        <p>Survey takes 5 minutes and opens in a new window <a href="javascript:void(0)" id="survey-no-thanks">No thanks</a></p>\
        <p class="right"><a href="javascript:void(0)" id="take-survey" class="button">5 min survey</a></p>\
      </div>\
    </section>';

    beforeEach(function () {
      document.body.insertAdjacentHTML("afterbegin", block);

      surveyElement = document.getElementById("user-satisfaction-survey");
      surveyElement.style.display = "none";

      survey = GOVUK.userSatisfaction;
    });

    afterEach(function () {
      // Remove the cookie that we're setting.
      Alphagov.delete_cookie(survey.cookieNameTakenSurvey);

      (elem = document.getElementById("user-satisfaction-survey")).parentNode.removeChild(elem);

      survey = null;
    });

    it("should display the user satisfaction div", function () {
      expect(surveyElement.style.display).toBe("none");
      survey.showSurveyBar();
      expect(surveyElement.style.display).toBe("block");
    });

    it("should randomly display the user satisfaction div", function () {
      var counter = 0;
      for (var i = 0; i < 50; i++) {
        surveyElement.style.display = "none";
        survey.randomlyShowSurveyBar();

        if (surveyElement.style.display == "block") {
          counter += 1;
        }
      }

      expect(counter).toBeGreaterThan(0);
      expect(counter).toBeLessThan(15);
    });

    it("should not display the user satisfaction div if another notification banner is visible", function() {
      $('#global-cookie-message').css('display', 'block');

      survey.showSurveyBar();
      expect(surveyElement.style.display).toBe("none");
    });

    it("shouldn't show the user satisfaction div if the 'survey taken' cookie is set", function () {
      setCookie(survey.cookieNameTakenSurvey, 'true');

      var counter = 0;
      for (var i = 0; i < 100; i++) {
        survey.randomlyShowSurveyBar();

        if (surveyElement.style.display == "block") {
          counter += 1;
          break;
        }
      }

      expect(counter).toBe(0);
    });

    describe("Event handlers", function () {
      it("should set a cookie when clicking 'take survey'", function () {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect(getCookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should set a cookie when clicking 'no thanks'", function () {
        survey.showSurveyBar();

        var noThanks = document.getElementById("survey-no-thanks");
        clickElem(noThanks);

        expect(getCookie(survey.cookieNameTakenSurvey)).toBe('true');
      });

      it("should hide the satisfaction survey bar after clicking 'take survey'", function () {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect(surveyElement.style.display).toBe("none");
      });

      it("should hide the satisfaction survey bar after clicking 'no thanks'", function () {
        survey.showSurveyBar();

        var noThanks = document.getElementById("survey-no-thanks");
        clickElem(noThanks);

        expect(surveyElement.style.display).toBe("none");
      });

      it("should append the current path to the url when clicking 'take survey'", function() {
        survey.showSurveyBar();

        var takeSurvey = document.getElementById("take-survey");
        clickElem(takeSurvey);

        expect(takeSurvey.getAttribute("href")).toBe("javascript:void(0)?c=/");
      })
    });
  });
});
