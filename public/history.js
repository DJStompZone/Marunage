"use strict";

const app = angular.module("app", []);

app.component("myApp", {
  template: `<history></history>`,
  controller: function() {
    this.$onInit = function() {
      console.log(this);
    };
  },
});

app.component("history", {
  template: `
    <figure ng-repeat="history in $ctrl.histories track by $index">
      <img lazyload="1" src={{history.url}}>
      <figcation><a href={{history.url}} target="_blank">{{history.url}}</a></figcation>
    </figure>
  `,
  controller: HistoryCtrl
});

function HistoryCtrl ($http) {
  this.$onInit = () => {
    $http.get('/api/history/list').success((data) => {
      console.log(data);
      this.histories = data.history;
    });
  };
}

angular.bootstrap(document.body, [app.name]);