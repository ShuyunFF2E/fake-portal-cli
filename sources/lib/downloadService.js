class DownloadService {
	/**
	 * 下载blob格式文件
	 * @param path
	 * @param data
	 * @param fileName
	 * @returns {Promise<void>}
	 */
	async blobFile(path, data, fileName) {
        return Promise.resolve();
	}

	/**
	 * 下载oss格式文件
	 * @param path
	 * @param fileName
	 * @returns {Promise<void>}
	 */
	async ossFile(path, fileName) {
		return Promise.resolve();
	}

	/**
	 * 下载前端自生成文件
	 * @param fileName
	 * @returns {Promise<void>}
	 */
	async f2eFile(fileName) {
        return Promise.resolve();
	}
}
window[window.CACHE_KEY].downloadService = new DownloadService();
