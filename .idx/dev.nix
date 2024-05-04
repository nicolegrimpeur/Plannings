{pkgs}: {
  channel = "stable-23.11";
  packages = [
    pkgs.nodejs_20
    pkgs.npm-check-updates
  ];
  idx.extensions = [
    "angular.ng-template"
  ];
}