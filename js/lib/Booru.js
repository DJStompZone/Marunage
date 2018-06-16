const Browser = require('./Browser');

module.exports = class Booru extends Browser {
  constructor({ resizeOptions }) {
    super({ url: 'https://waifu2x.booru.pics/' });
    this.resizeOptions = resizeOptions;
  }

  /**
   * puppetterのlaunchやgoto処理はすべて親クラスで行う。ページアクセス後の処理をこの関数内に記述してtask関数として渡す。
   */
  async download() {
    const task = async ({ page }) => {
      console.log('this.resizeOptions => ', this.resizeOptions);
      const tabs = await page.$$('.nav.nav-tabs li');
      await tabs[1].click();
      await page.type('#url input[name="url"]', this.resizeOptions.url);
      await page.click(
        '#url input[name="denoise"]',
        this.resizeOptions.denoise,
      );
      await page.click('#url input[name="scale"]', this.resizeOptions.scale);
      await page.click('#url #submit');
      await page.waitForNavigation({ waitUntil: 'networkidle0' }),
        await page.waitForNavigation({
          timeout: 1000 * 15,
          waitUntil: 'domcontentloaded',
        });
    };

    await this.go({ task });
  }

  format() {
    if (this.counts.length < 3) throw new Error('counts array is empty');
    return {
      date: dayjs().format('YYYY-MM-DD'),
      post: this.counts[0],
      doneOnce: this.counts[1],
      doneDup: this.counts[2],
    };
  }
};
