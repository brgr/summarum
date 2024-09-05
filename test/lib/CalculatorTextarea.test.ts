import {render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {expect, test} from 'vitest';

// import Greeter from './greeter.svelte'
import CalculatorTextarea from '../../src/lib/CalculatorTextarea.svelte';

test('CalculatorTextarea renders the textarea', () => {
    const {container} = render(CalculatorTextarea);

    const textarea = container.querySelector('.calculator-textarea');

    expect(textarea).not.toBeNull();
    expect(textarea).toBeInTheDocument();
    // @ts-ignore
    expect(textarea.textContent).toBe('');
});

test('CalculatorTextarea: enter a letter in an editor-line', async () => {
    const {container} = render(CalculatorTextarea);

    // const textarea = container.querySelector('.calculator-textarea')!;
    const textarea = container.querySelector('.editor-line')!;
    await userEvent.type(textarea, 'a');

    expect(textarea).toHaveTextContent('a');
    expect(textarea.outerHTML).toEqual('<div class="editor-line" contenteditable="true">a<br></div>');
});

test('CalculatorTextarea: enter a letter in the calculator-textarea', async () => {
    const {container} = render(CalculatorTextarea);

    const textarea = container.querySelector('.calculator-textarea')!;
    await userEvent.type(textarea, 'a');

    expect(textarea).toHaveTextContent('a');
    expect(textarea.innerHTML).toEqual('<div class="editor-line" contenteditable="true">a<br></div>');
});

test('CalculatorTextarea: enter a letter in the CalculatorTextarea component', async () => {
    render(CalculatorTextarea);

    const textarea = screen.getByLabelText('calculator-textarea');
    await userEvent.type(textarea, 'a');

    expect(textarea).toHaveTextContent('a');
    console.log(textarea.innerHTML);
    expect(textarea.innerHTML).toEqual('<div class="editor-line" contenteditable="true">a<br></div>');
});


// TODO: Add a test for syntax highlighting of numbers
// TODO: A test where the user presses only the backspace key at start
