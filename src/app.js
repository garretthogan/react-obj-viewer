class App {
  constructor(node) {
    this._el = node;
    this._model = {
      title: 'Hello world!',
      description: 'This is a description...'
    };
  }
  _getTemplate() {
    const {title, description} = this._model;
    return (`
      <div>
        <h1>${title}</h1>
        <p>${description}</p>
      </div>
    `);
  }
  render() {
    const {title} = this._model;
    this._el.innerHTML = this._getTemplate();
  }
}

const app = new App(document.getElementById('app'));
app.render();
