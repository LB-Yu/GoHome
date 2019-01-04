package ui.utils;

/**
 * @author Huleryo
 * @date 2017/7/16
 *
 * 文件头类型枚举
 */

public enum FileType {
    /**
     * JEPG.
     */
    JPEG("FFD8FF"),

    /**
     * Windows Bitmap.
     */
    BMP("424D"),

    /**
     * PNG.
     */
    PNG("89504E47");

    private String value = "";

    /**
     * Constructor.
     *
     * @param value
     */
    FileType(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
