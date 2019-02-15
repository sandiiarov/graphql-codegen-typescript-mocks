workflow "TSC, Build and Publish" {
  on = "push"
  resolves = ["TSC", "Publish package"]
}

action "Install" {
  uses = "actions/npm@master"
  runs = "yarn"
  args = "install"
}

action "TSC" {
  needs = "Install"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "tsc"
}

action "Master" {
  needs = "TSC"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Build package" {
  needs = "Master"
  uses = "actions/npm@master"
  runs = "yarn"
  args = "build"
}

action "Publish package" {
  needs = "Master"
  uses = "actions/npm@master"
  args = "publish --access public"
  secrets = ["NPM_AUTH_TOKEN"]
}
