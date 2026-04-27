import { CustomButton } from './button.js';

export class PrintButton extends CustomButton {
	constructor() {
		super();

		this.addEventListener('click', ({ currentTarget }) => {
			if (! currentTarget.disabled) {
				globalThis.print();
			}
		});
	}

	static {
		this.register('print-button');
	}
}
