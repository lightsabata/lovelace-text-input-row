const LitElement = customElements.get('home-assistant-main') ? Object.getPrototypeOf(customElements.get('home-assistant-main')) : Object.getPrototypeOf(customElements.get('hui-view'));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class TextInputRow extends LitElement {
  static get properties() {
    return {
      label: { type: String },
      value: { type: String },
      minlength: { type: Number },
      maxlength: { type: Number },
      pattern: { type: String },
      mode: { type: String },
      stateObj: { type: Object },
      _config: { type: Object },
    };
  }
  
  constructor() {
    super();
    this.label = '';
    this.value = '';
    this.minlength = 0;
    this.maxlength = Infinity;
    this.pattern = '';
    this.mode = '';
    this.stateObj = null;
    this._config = null;
  }
  
  render() {
    return html`
      <ha-textfield
          label="${this.label}"
          style="width: 100%"
          value="${this.value}"
          minlength="${this.minlength}"
          maxlength="${this.maxlength}"
          autoValidate="${this.pattern}"
          pattern="${this.pattern}"
          type="${this.mode}"
          @change="${this.valueChanged}"
          id="textinput"
          placeholder=""
        ></ha-textfield>
    `;
  }

  ready() {
    super.ready();
    this.shadowRoot.querySelector('#textinput').addEventListener('change', this.valueChanged.bind(this));
  }

  setConfig(config) {
    this._config = config;
  }

  valueChanged(ev) {
    const newValue = this.shadowRoot.querySelector("#textinput").value;
    // Créez une URL de recherche Google
    const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(newValue)}`;
    // Ouvrir l'URL dans un nouvel onglet
    window.open(googleSearchUrl, '_blank');
  }

  computeObjectId(entityId) {
    return entityId.substr(entityId.indexOf(".") + 1);
  }

  computeStateName(stateObj){
    return stateObj.attributes.friendly_name === undefined 
    ? this.computeObjectId(stateObj.entity_id).replace(/_/g, " ") 
    : stateObj.attributes.friendly_name || "";
  }

  set hass(hass) {
    this._hass = hass;
    this.stateObj = hass.states[this._config.entity];
    if(this.stateObj) {
      this.value = this.stateObj.state;
      this.minlength = this.stateObj.attributes.min;
      this.maxlength = this.stateObj.attributes.max;
      this.pattern = this.stateObj.attributes.pattern;
      this.mode = this.minlength = this.stateObj.attributes.mode;
      this.label = this._config.name ? this._config.name : this.computeStateName(this.stateObj);
    }
  }
}

customElements.define('text-input-row', TextInputRow);
