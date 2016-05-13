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
    <figure ng-repeat="url in $ctrl.history track by $index">
      <img lazyload="1" src={{url}}>
      <figcation><a href={{url}} target="_blank">{{url}}</a></figcation>
    </figure>
  `,
  controller: HistoryCtrl
});

function HistoryCtrl ($http) {
  this.$onInit = () => {
    $http.get('/api/history/list').success((data) => {
      console.log(data);
      this.history = data.history.reverse();
    });
  };
}

angular.bootstrap(document.body, [app.name]);