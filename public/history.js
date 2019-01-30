'use strict';

const app = angular.module('app', []);

app.component('myApp', {
  template: `<history></history>`,
  controller: function() {
    this.$onInit = function() {
      console.log(this);
    };
  },
});

app.component('history', {
  template: `
    <section class="history__container">
      <figure ng-repeat="history in $ctrl.histories track by $index">
        <img lazyload="1" src={{history.url}}>
        <figcation><a href={{history.url}} target="_blank">{{history.url}}</a></figcation>
      </figure>
      <section class="menu">
        <button class="button button-expand" ng-disabled="$ctrl.isLast" ng-click="$ctrl.next();">次の20件</button>
      </section>
    </section>
  `,
  controller: HistoryCtrl,
});

function HistoryCtrl($http) {
  this.$onInit = () => {
    this.page = 0;
    this.limit = 20;
    this.isLast = false;
    this.histories = [];
    this.fetchHistory(
      this.createQueryString({ page: this.page, limit: this.limit }),
    );
  };
  this.createQueryString = json => {
    return Object.keys(json)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`)
      .join('&');
  };
  this.fetchHistory = qs => {
    $http
      .get(`/api/history/list?${qs}`)
      .then(response => {
        if (!response.data.history.length) {
          this.isLast = true;
          return;
        }
        this.histories.concat(response.data.history);
        response.data.history.map(history => this.histories.push(history));
      })
      .catch(err => {
        console.log(err);
      });
  };
  this.next = () => {
    this.page++;
    this.fetchHistory(
      this.createQueryString({ page: this.page, limit: this.limit }),
    );
  };
}

angular.bootstrap(document.body, [app.name]);
