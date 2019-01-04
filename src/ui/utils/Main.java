package ui.utils;

import java.util.Scanner;

/**
 * Created by 余乐悠 on 2017/11/29.
 */
public class Main {

    public static void main(String[] args) {
        int i,n;
        char ch;
        String str,s;
        Scanner in=new Scanner(System.in);
        n=in.nextInt();
        for(i=1;i<=n;i++)
        {   s="";
            str=in.next();
       /*---------*/
            for( i=str.length()-1;i>=0;i--){
                ch=str.charAt(i) ;
                s=s+ch;
            }
            System.out.print(s);
        }
    }
}
