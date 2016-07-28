(function() {
  "use strict";

  window.GOVUK = window.GOVUK || {};

  var CONFIG = {
    '/': [
      ['Heading', 'Services and information'],
      ['Heading', 'More on GOV.UK'],
      ['Percent', 80] //To track 'Services and information' section in footer
    ],
    '/bank-holidays': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/jobsearch': [
      ['Heading', 'Registration'],
      ['Heading', 'Help']
    ],
    '/register-to-vote': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/apply-uk-visa': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/student-finance-register-login': [
      ['Heading', 'Log in problems'],
      ['Heading', 'Manage your student finance']
    ],
    '/contact-the-dvla/y/driving-licences-and-applications': [
      ['Heading', 'Driving licencing enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/contact-the-dvla/y/vehicle-tax-and-sorn': [
      ['Heading', 'Vehicle tax enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/contact-the-dvla/y/vehicle-registration-and-v5c-certificates-log-books': [
      ['Heading', 'Vehicle registration enquiries'],
      ['Heading', 'When to contact DVLA']
    ],
    '/using-the-civil-service-jobs-website': [
      ['Heading', 'Your Civil Service Jobs account'],
      ['Heading', 'Job alerts'],
      ['Heading', 'Applying for a job'],
      ['Heading', 'Civil Service Initial Sift Test'],
      ['Heading', 'Results and feedback'],
      ['Heading', 'Civil Service recruitment'],
      ['Heading', 'Technical Support'],
      ['Heading', 'Contact Information']
    ],
    '/government/publications/spending-review-and-autumn-statement-2015-documents/spending-review-and-autumn-statement-2015': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/guidance/universal-credit-how-it-helps-you-into-work': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75],
      ['Heading', 'Opening up work'],
      ['Heading', 'Support from your work coach'],
      ['Heading', 'When you can claim Universal Credit'],
      ['Heading', 'More detailed advice']
    ],
    '/openingupwork': [
      ['Heading', 'How Universal Credit makes work pay'],
      ['Heading', 'When you can claim Universal Credit'],
      ['Heading', 'Help and advice']
    ],
    '/guidance/universal-credit-how-it-can-help-your-business': [
      ['Percent', 25],
      ['Percent', 50],
      ['Percent', 75]
    ],
    '/government/publications/see-potential-case-studies-and-guidance-for-employers/see-potential-case-studies-and-guidance-for-employers': [
      ['Heading', 'Case studies'],
      ['Heading', 'The business benefits'],
      ['Heading', 'What people are saying'],
      ['Heading', 'Review your recruitment approach to make sure you’re not missing out on talent and potential']
    ],
    '/government/groups/common-technology-services-cts': [
      ['Heading', 'Our products'],
      ['Heading', 'Our services'],
      ['Heading', 'Our priorities']
    ],
    '/guidance/common-technology-services-cts-secure-email-blueprint': [
      ['Heading', '1. Understand government policy'],
      ['Heading', '2. Follow our technical specification'],
      ['Heading', '3. Change email domain names as required'],
      ['Heading', '5. Get CTS’ assurance'],
      ['Heading', '6. Maintain your documentation and end user policies'],
      ['Heading', '7. Buy the solution']
    ],
    '/guidance/common-technology-services-cts-guide-to-implementing-the-secure-email-blueprint': [
      ['Heading', 'Email service prerequisites'],
      ['Heading', 'Transport Layer Security (TLS)'],
      ['Heading', 'Domain-based Message Authentication, Reporting and Conformance (DMARC)'],
      ['Heading', 'DomainKeys Identified Mail (DKIM)'],
      ['Heading', 'Sender Policy Framework (SPF)'],
      ['Heading', 'Other email sending services'],
      ['Heading', 'Making DNS changes'],
      ['Heading', 'Assurance']
    ],
    '/government/publications/budget-2016-documents/budget-2016': [
      ['Percent', 20],
      ['Percent', 40],
      ['Percent', 60],
      ['Percent', 80],
      ['Percent', 100]
    ],
    '/government/collections/disability-confident-campaign': [
      ['Heading', 'Become a Disability Confident employer'],
      ['Heading', 'Aims and objectives'],
      ['Heading', 'Inclusive communication']  
    ],
    '/government/publications/the-essential-trustee-what-you-need-to-know-cc3/the-essential-trustee-what-you-need-to-know-what-you-need-to-do': [
      ['Heading', '1. About this guidance'],
      ['Heading', '2. Trustees’ duties at a glance'],
      ['Heading', '3. Who can be a trustee and how trustees are appointed'],
      ['Heading', '4. Ensure your charity is carrying out its purposes for the public benefit'],
      ['Heading', '5. Comply with your charity’s governing document and the law'],
      ['Heading', '6. Act in your charity’s best interests'],
      ['Heading', '7. Manage your charity’s resources responsibly'],
      ['Heading', '8. Act with reasonable care and skill'],
      ['Heading', '9. Ensure your charity is accountable'],
      ['Heading', '10. Reduce the risk of liability'],
      ['Heading', '11. Your charity’s legal structure and what it means'],
      ['Heading', '12. Charity officers - the chair and treasurer'],
      ['Heading', '13. Technical terms used in this guidance']
    ]
  };

  function ScrollTracker(sitewideConfig) {
    this.config = this.getConfigForCurrentPath(sitewideConfig);
    this.SCROLL_TIMEOUT_DELAY = 500;

    if ( !this.config ) {
      this.enabled = false;
      return;
    }
    this.enabled = true;

    this.trackedNodes = this.buildNodes(this.config);

    $(window).scroll($.proxy(this.onScroll, this));
    this.trackVisibleNodes();
  };

  ScrollTracker.prototype.getConfigForCurrentPath = function (sitewideConfig) {
    for ( var path in sitewideConfig ) {
      if ( window.location.pathname == path ) return sitewideConfig[path];
    }
  };

  ScrollTracker.prototype.buildNodes = function (config) {
    var nodes = [];
    var nodeConstructor, nodeData;

    for (var i=0; i<config.length; i++) {
      nodeConstructor = ScrollTracker[config[i][0] + "Node"];
      nodeData = config[i][1];
      nodes.push(new nodeConstructor(nodeData));
    }

    return nodes;
  };

  ScrollTracker.prototype.onScroll = function () {
    clearTimeout(this.scrollTimeout);
    this.scrollTimeout = setTimeout($.proxy(this.trackVisibleNodes, this), this.SCROLL_TIMEOUT_DELAY);
  };

  ScrollTracker.prototype.trackVisibleNodes = function () {
    for ( var i=0; i<this.trackedNodes.length; i++ ) {
      if ( this.trackedNodes[i].isVisible() && !this.trackedNodes[i].alreadySeen ) {
        this.trackedNodes[i].alreadySeen = true;

        var action = this.trackedNodes[i].eventData.action,
            label = this.trackedNodes[i].eventData.label;

        GOVUK.analytics.trackEvent('ScrollTo', action, {label: label, nonInteraction: true});
      }
    }
  };

  ScrollTracker.PercentNode = function (percentage) {
    this.percentage = percentage;
    this.eventData = {action: "Percent", label: String(percentage)};
  };

  ScrollTracker.PercentNode.prototype.isVisible = function () {
    return this.currentScrollPercent() >= this.percentage;
  };

  ScrollTracker.PercentNode.prototype.currentScrollPercent = function () {
    var $document = $(document);
    var $window = $(window);
    return( ($window.scrollTop() / ($document.height() - $window.height())) * 100.0 );
  };

  ScrollTracker.HeadingNode = function (headingText) {
    this.$element = getHeadingElement(headingText);
    this.eventData = {action: "Heading", label: headingText};

    function getHeadingElement(headingText) {
      var $headings = $('h1, h2, h3, h4, h5, h6');
      for ( var i=0; i<$headings.length; i++ ) {
        if ( $.trim($headings.eq(i).text()).replace(/\s/g, ' ') == headingText ) return $headings.eq(i);
      }
    }
  };

  ScrollTracker.HeadingNode.prototype.isVisible = function () {
    if ( !this.$element ) return false;
    return this.elementIsVisible(this.$element);
  }

  ScrollTracker.HeadingNode.prototype.elementIsVisible = function ($element) {
    var $window = $(window);
    var positionTop = $element.offset().top;
    return ( positionTop > $window.scrollTop() && positionTop < ($window.scrollTop() + $window.height()) );
  };

  $().ready(function() {
    window.GOVUK.scrollTracker = new ScrollTracker(CONFIG);
  });

  window.GOVUK.ScrollTracker = ScrollTracker;
}());
