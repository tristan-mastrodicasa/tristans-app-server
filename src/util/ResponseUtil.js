
export default class Response {

  constructor () {
    this.error = { exists: false };
    this.content;
  }

  addContent(content) {
    this.content = content;
  }

  addError(content) {
    this.error.exists = true;
    this.error.errorInfo = content;
  }

  get output() {
    return { error: this.error, content: this.content };
  }

}
