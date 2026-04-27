import { CustomButton } from './button.js';

export class ReloadButton extends CustomButton {
	constructor() {
		super();

		this.addEventListener('click', ({ currentTarget }) => {
			if (! currentTarget.disabled) {
				location.reload();
			}
		});
	}

	static {
		this.register('reload-button');
	}
}
