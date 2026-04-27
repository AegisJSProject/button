import { reset } from '@aegisjsproject/styles/reset.js';
import { layers } from '@aegisjsproject/styles/layers.js';
import { customButton } from '@aegisjsproject/styles/custom-button.js';

const styles = [layers, reset, customButton];

export class CustomButton extends HTMLElement {
	#shadow = this.attachShadow({ mode: 'open' });
	#internals = this.attachInternals();
	#oldTabIndex = NaN;
	#controller;

	constructor() {
		super();

		this.#shadow.adoptedStyleSheets = styles;
		this.#internals.role = 'button';
	}

	connectedCallback() {
		this.#controller = new AbortController();

		if (this.#shadow.childElementCount === 0) {
			this.#shadow.append(document.createElement('slot'));
		}

		if (! (this.hasAttribute('tabindex') || this.disabled)) {
			this.tabIndex = 0;
		}

		this.addEventListener('keydown', event => {
			if (event.key === 'Enter' && ! this.disabled) {
				event.preventDefault();
				event.currentTarget.click();
			} else if (event.key === ' ' && ! this.disabled) {
				event.preventDefault();
			}
		}, { signal: this.#controller.signal });

		this.addEventListener('keyup', event => {
			if (event.key === ' ' && ! this.disabled) {
				event.preventDefault();
				event.currentTarget.click();
			}
		}, { signal: this.#controller.signal });
	}

	attributeChangedCallback(name, oldVal, newVal) {
		switch(name) {
			case 'disabled':
				if (typeof newVal === 'string') {
					this.#oldTabIndex = this.hasAttribute('tabindex') ? this.tabIndex : 0;
					this.tabIndex = -1;
					this.#internals.states.add('disabled');
					this.#internals.ariaDisabled = 'true';

					if (this.isSameNode(this.ownerDocument.activeElement)) {
						this.blur();
					}
				} else {
					this.#internals.states.delete('disabled');
					this.#internals.ariaDisabled = null;
					this.tabIndex = Number.isNaN(this.#oldTabIndex) ? 0 : this.#oldTabIndex;
				}
				break;
		}
	}

	disconnectedCallback() {
		this.#controller.abort();
	}

	get disabled() {
		return this.hasAttribute('disabled');
	}

	set disabled(val) {
		this.toggleAttribute('disabled', val);
	}

	static get observedAttributes() {
		return ['disabled'];
	}

	static register(tag) {
		customElements.define(tag, this);
	}
}
