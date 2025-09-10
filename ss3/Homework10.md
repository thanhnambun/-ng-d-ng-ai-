### Đoạn mã bị lỗi

```java
public class Calculator {
    public static void main(String[] args) {
        int result = add(5, 10);
        System.out.println("Result: " + result);
    }

    public static int add(int a, int b) {
        int sum;
        sum = a + b;
    }
}
```

- Prompt yêu cầu: Với vai trờ là một lập trình viên lâu năm trong lĩnh vực lập trình, đặc biệt là Java, hãy kiểm tra lỗi trong đoạn mã trên. Đồng thời giải thích tại sao đoạn mã đó lại sai và gợi ý cách sửa cho người mới và đang trong quá trình học và làm chủ Java, cuối cùng đưa ra một vài vvis dụ đơn giản sau khi sửa.

Kết quả:

```
🔎 Lỗi trong đoạn mã

Trong method add(int a, int b), bạn đã tính được sum = a + b; nhưng không hề trả về giá trị nào cả.

Trong Java, khi bạn khai báo public static int add(...), tức là method này phải return một số nguyên (int).

Nhưng trong code, bạn chỉ gán giá trị cho biến sum rồi… bỏ đó luôn, không có return sum;.

Kết quả là chương trình sẽ không compile được với lỗi kiểu:

error: missing return statement

🛠 Giải thích cho người mới học Java

Java khá “nghiêm khắc”:

Nếu method khai báo kiểu trả về (int, String, double, …) thì bắt buộc bạn phải có return trả về giá trị đúng kiểu.

Nếu bạn không cần trả về gì, hãy khai báo method là void.

Trong trường hợp này, bạn muốn lấy kết quả cộng để in ra ngoài, nên cách đúng là phải return sum;.

```

```java
✅ Cách sửa
public class Calculator {
    public static void main(String[] args) {
        int result = add(5, 10);
        System.out.println("Result: " + result);
    }

    public static int add(int a, int b) {
        int sum;
        sum = a + b;
        return sum; // 👈 bắt buộc phải có
    }
}
```

```java
📚 Ví dụ đơn giản khác (sau khi sửa)

Trả về trực tiếp:

public static int add(int a, int b) {
    return a + b;
}


Thêm nhiều phép toán:

public static int subtract(int a, int b) {
    return a - b;
}

public static int multiply(int a, int b) {
    return a * b;
}

public static int divide(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("Không thể chia cho 0");
    }
    return a / b;
}


Sử dụng trong main:

public static void main(String[] args) {
    System.out.println("Add: " + add(3, 7));
    System.out.println("Subtract: " + subtract(10, 4));
    System.out.println("Multiply: " + multiply(6, 5));
    System.out.println("Divide: " + divide(20, 4));
}
```
