import {test, expect} from '@playwright/test';

/*
 * Some notes on using Playwright:
 * - Add `--debug` to the Playwright command to be able to debug the browser
 * - Use `await new Promise(() => {});` to wait forever
 */

test('CalculatorTextarea: enter "1000" and expect it to output "1000"', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('1000');

    let textContent = await textbox.textContent();

    // First is the input, second is the (non-editable) math output
    expect(textContent).toEqual('1000');
});


test('Add "a" and expect it to output nothing', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('a');

    let textContent = await textbox.textContent();

    // First is the input, second is the (non-editable) math output - which is empty here
    expect(textContent).toEqual('a');
});


test('Fill "hello" and expect it to output nothing', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('hello');

    let textContent = await textbox.textContent();

    // First is the input, second is the (non-editable) math output - which is empty here
    expect(textContent).toEqual('hello');
});


test('Fill "10 + 2" and expect it to output "12"', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('10 + 2');

    let textContent = await textbox.textContent();

    // First is the input, last is the (non-editable) math output
    expect(textContent).toEqual('10 + 2');
});


test('Fill "Now number 5" and expect it to output nothing', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('Now number 5');

    let textContent = await textbox.textContent();

    // First is the input, second is the (non-editable) math output - which is empty here
    expect(textContent).toEqual('Now number 5');
});

test('Fill two numbers in two lines', async ({page}) => {
    await page.goto('http://localhost:5173/');

    let textbox = page.getByRole('textbox');
    await textbox.locator('div').click();
    await textbox.fill('10\n2');

    let textContent = await textbox.textContent();

    // First is the input, last is the (non-editable) math output - for each line
    expect(textContent).toEqual('102');
});
