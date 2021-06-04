package anywheresoftware.b4a;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.app.Application;
import android.app.Service;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.Resources;
import android.os.Handler;
import android.os.Process;
import android.preference.PreferenceManager.OnActivityResultListener;
import android.util.DisplayMetrics;
import android.util.Log;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.lang.annotation.Annotation;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.ref.WeakReference;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.Future;

public class BA
{
  private static byte[][] _b;
  public static Application applicationContext;
  public static IBridgeLog bridgeLog;
  private static int checkStackTraceEvery50;
  public static final Locale cul;
  public static String debugLine;
  public static int debugLineNum;
  public static boolean debugMode = false;
  public static float density;
  public static final Handler handler;
  public static NumberFormat numberFormat;
  public static String packageName;
  public static final ThreadLocal<Object> senderHolder;
  public static boolean shellMode = false;
  private static volatile B4AThreadPool threadPool;
  private static HashMap<String, ArrayList<Runnable>> uninitializedActivitiesMessagesDuringPaused;
  public static WarningEngine warningEngine;
  public final Activity activity;
  public final String className;
  public final Context context;
  public final Object eventsTarget;
  public final HashMap<String, Method> htSubs;
  public final BA processBA;
  public Service service;
  public final SharedProcessBA sharedProcessBA;
  public final BALayout vg;

  static
  {
    density = 1.0F;
    handler = new Handler();
    cul = Locale.US;
    senderHolder = new ThreadLocal();
    Thread.setDefaultUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler()
    {
      final Thread.UncaughtExceptionHandler original = Thread.getDefaultUncaughtExceptionHandler();

      public void uncaughtException(Thread paramThread, Throwable paramThrowable)
      {
        BA.printException(paramThrowable, true);
        if (BA.bridgeLog != null);
        try
        {
          Thread.sleep(100L);
          label18: this.original.uncaughtException(paramThread, paramThrowable);
          return;
        }
        catch (InterruptedException localInterruptedException)
        {
          break label18;
        }
      }
    });
  }

  public BA(Context paramContext, BALayout paramBALayout, BA paramBA, String paramString1, String paramString2)
  {
    if (paramContext != null)
      density = paramContext.getResources().getDisplayMetrics().density;
    Activity localActivity;
    boolean bool;
    if ((paramContext != null) && ((paramContext instanceof Activity)))
    {
      localActivity = (Activity)paramContext;
      applicationContext = localActivity.getApplication();
      if ((paramContext == null) || (!(paramContext instanceof Service)))
        break label148;
      bool = true;
      applicationContext = ((Service)paramContext).getApplication();
    }
    while (true)
    {
      if (paramContext != null)
        packageName = paramContext.getPackageName();
      this.eventsTarget = null;
      this.context = paramContext;
      this.activity = localActivity;
      this.htSubs = new HashMap();
      this.className = paramString2;
      this.processBA = paramBA;
      this.vg = paramBALayout;
      if (paramBA != null)
        break label154;
      this.sharedProcessBA = new SharedProcessBA(bool);
      return;
      localActivity = null;
      break;
      label148: bool = false;
    }
    label154: this.sharedProcessBA = null;
  }

  public BA(BA paramBA, Object paramObject, HashMap<String, Method> paramHashMap, String paramString)
  {
    this.vg = paramBA.vg;
    this.eventsTarget = paramObject;
    if (paramHashMap == null)
      paramHashMap = new HashMap();
    this.htSubs = paramHashMap;
    this.processBA = null;
    this.activity = paramBA.activity;
    this.context = paramBA.context;
    this.service = paramBA.service;
    if (paramBA.sharedProcessBA == null);
    for (SharedProcessBA localSharedProcessBA = paramBA.processBA.sharedProcessBA; ; localSharedProcessBA = paramBA.sharedProcessBA)
    {
      this.sharedProcessBA = localSharedProcessBA;
      this.className = paramString;
      return;
    }
  }

  public static char CharFromString(String paramString)
  {
    if ((paramString == null) || (paramString.length() == 0))
      return '\000';
    return paramString.charAt(0);
  }

  public static void Log(String paramString)
  {
    if (paramString == null);
    for (String str = "null"; ; str = paramString)
    {
      Log.i("B4A", str);
      if ((paramString != null) && (paramString.length() > 4000))
        LogInfo("Message longer than Log limit (4000). Message was truncated.");
      if (bridgeLog != null)
        bridgeLog.offer(paramString);
      return;
    }
  }

  public static void LogError(String paramString)
  {
    addLogPrefix("e", paramString);
  }

  public static void LogInfo(String paramString)
  {
    addLogPrefix("i", paramString);
  }

  public static String NumberToString(double paramDouble)
  {
    String str = Double.toString(paramDouble);
    if ((str.length() > 2) && (str.charAt(-2 + str.length()) == '.') && (str.charAt(-1 + str.length()) == '0'))
      str = str.substring(0, -2 + str.length());
    return str;
  }

  public static String NumberToString(float paramFloat)
  {
    return NumberToString(paramFloat);
  }

  public static String NumberToString(int paramInt)
  {
    return String.valueOf(paramInt);
  }

  public static String NumberToString(long paramLong)
  {
    return String.valueOf(paramLong);
  }

  public static String NumberToString(Number paramNumber)
  {
    return String.valueOf(paramNumber);
  }

  public static boolean ObjectToBoolean(Object paramObject)
  {
    if ((paramObject instanceof Boolean))
      return ((Boolean)paramObject).booleanValue();
    return parseBoolean(String.valueOf(paramObject));
  }

  public static char ObjectToChar(Object paramObject)
  {
    if ((paramObject instanceof Character))
      return ((Character)paramObject).charValue();
    return CharFromString(paramObject.toString());
  }

  public static long ObjectToLongNumber(Object paramObject)
  {
    if ((paramObject instanceof Number))
      return ((Number)paramObject).longValue();
    return Long.parseLong(String.valueOf(paramObject));
  }

  public static double ObjectToNumber(Object paramObject)
  {
    if ((paramObject instanceof Number))
      return ((Number)paramObject).doubleValue();
    return Double.parseDouble(String.valueOf(paramObject));
  }

  public static String ObjectToString(Object paramObject)
  {
    return String.valueOf(paramObject);
  }

  public static String TypeToString(Object paramObject, boolean paramBoolean)
  {
    for (int i = 0; ; i++)
      try
      {
        int j = 1 + checkStackTraceEvery50;
        checkStackTraceEvery50 = j;
        if ((j % 50 == 0) || (checkStackTraceEvery50 < 0))
        {
          int k = Thread.currentThread().getStackTrace().length;
          if (checkStackTraceEvery50 < 0);
          for (int m = 20; k >= m; m = 150)
          {
            checkStackTraceEvery50 = -100;
            return "";
          }
          checkStackTraceEvery50 = 0;
        }
        StringBuilder localStringBuilder = new StringBuilder();
        localStringBuilder.append("[");
        int n = 0;
        Field[] arrayOfField = paramObject.getClass().getDeclaredFields();
        int i1 = arrayOfField.length;
        if (i >= i1)
        {
          if (localStringBuilder.length() >= 2)
            localStringBuilder.setLength(-2 + localStringBuilder.length());
          localStringBuilder.append("]");
          return localStringBuilder.toString();
        }
        Field localField = arrayOfField[i];
        String str = localField.getName();
        if (paramBoolean)
        {
          if (!str.startsWith("_"))
            continue;
          str = str.substring(1);
          if (str.startsWith("_"))
            continue;
        }
        localField.setAccessible(true);
        localStringBuilder.append(str).append("=").append(String.valueOf(localField.get(paramObject)));
        n++;
        if (n % 3 == 0)
          localStringBuilder.append("\n");
        localStringBuilder.append(", ");
      }
      catch (Exception localException)
      {
        return "N/A";
      }
  }

  public static String __b(byte[] paramArrayOfByte, int paramInt)
    throws UnsupportedEncodingException, PackageManager.NameNotFoundException
  {
    new PreferenceManager.OnActivityResultListener(paramInt, paramArrayOfByte)
    {
      public boolean onActivityResult(int paramInt1, int paramInt2, Intent paramIntent)
      {
        return false;
      }
    };
    return new String(paramArrayOfByte, "UTF8");
  }

  public static void addLogPrefix(String paramString1, String paramString2)
  {
    String str = "~" + paramString1 + ":";
    StringBuilder localStringBuilder;
    int i;
    int j;
    if (paramString2.length() < 3900)
    {
      localStringBuilder = new StringBuilder();
      localStringBuilder.append(str);
      i = -1;
      j = 0;
      i = paramString2.indexOf('\n', i + 1);
      if (i != -1)
        break label102;
      if (j >= paramString2.length())
        break label153;
      localStringBuilder.append(paramString2.substring(j));
    }
    while (true)
    {
      paramString2 = localStringBuilder.toString();
      Log(paramString2);
      return;
      label102: if (j == i)
        localStringBuilder.setLength(localStringBuilder.length() - str.length());
      while (true)
      {
        j = i + 1;
        break;
        localStringBuilder.append(paramString2.substring(j, i + 1)).append(str);
      }
      label153: localStringBuilder.setLength(localStringBuilder.length() - str.length());
    }
  }

  public static void addMessageToUninitializeActivity(String paramString1, String paramString2, Object[] paramArrayOfObject)
  {
    if (uninitializedActivitiesMessagesDuringPaused == null)
      uninitializedActivitiesMessagesDuringPaused = new HashMap();
    ArrayList localArrayList = (ArrayList)uninitializedActivitiesMessagesDuringPaused.get(paramString1);
    if (localArrayList == null)
    {
      localArrayList = new ArrayList();
      uninitializedActivitiesMessagesDuringPaused.put(paramString1, localArrayList);
    }
    if (localArrayList.size() < 20)
    {
      RaiseEventWhenFirstCreate localRaiseEventWhenFirstCreate = new RaiseEventWhenFirstCreate(null);
      localRaiseEventWhenFirstCreate.eventName = paramString2;
      localRaiseEventWhenFirstCreate.arguments = paramArrayOfObject;
      Log("sending message to waiting queue of uninitialized activity (" + paramString2 + ")");
      localArrayList.add(localRaiseEventWhenFirstCreate);
    }
  }

  public static boolean fastSubCompare(String paramString1, String paramString2)
  {
    if (paramString1 == paramString2);
    while (true)
    {
      return true;
      if (paramString1.length() != paramString2.length())
        return false;
      for (int i = 0; i < paramString1.length(); i++)
        if ((0xDF & paramString1.charAt(i)) != (0xDF & paramString2.charAt(i)))
          return false;
    }
  }

  public static <T extends Enum<T>> T getEnumFromString(Class<T> paramClass, String paramString)
  {
    return Enum.valueOf(paramClass, paramString);
  }

  public static <T> T gm(Map paramMap, Object paramObject, T paramT)
  {
    Object localObject = paramMap.get(paramObject);
    if (localObject == null)
      return paramT;
    return localObject;
  }

  public static boolean isShellModeRuntimeCheck(BA paramBA)
  {
    if (paramBA.processBA != null)
      return isShellModeRuntimeCheck(paramBA.processBA);
    return paramBA.getClass().getName().endsWith("ShellBA");
  }

  public static boolean isTaskRunning(Object paramObject, int paramInt)
  {
    if (threadPool == null)
      return false;
    return threadPool.isRunning(paramObject, paramInt);
  }

  private static void markTaskAsFinish(Object paramObject, int paramInt)
  {
    if (threadPool == null)
      return;
    threadPool.markTaskAsFinished(paramObject, paramInt);
  }

  public static boolean parseBoolean(String paramString)
  {
    if (paramString.equals("true"))
      return true;
    if (paramString.equals("false"))
      return false;
    throw new RuntimeException("Cannot parse: " + paramString + " as boolean");
  }

  public static String printException(Throwable paramThrowable, boolean paramBoolean)
  {
    String str1 = "";
    StackTraceElement localStackTraceElement;
    String str2;
    if (!shellMode)
    {
      StackTraceElement[] arrayOfStackTraceElement = paramThrowable.getStackTrace();
      if (arrayOfStackTraceElement.length != 0)
      {
        localStackTraceElement = arrayOfStackTraceElement[0];
        if (localStackTraceElement.getClassName().startsWith(packageName))
        {
          str2 = localStackTraceElement.getClassName().substring(1 + packageName.length()) + localStackTraceElement.getMethodName();
          if (debugLine == null)
            break label194;
          str1 = str2 + " (B4A line: " + debugLineNum + ")\n" + debugLine;
        }
      }
    }
    while (true)
    {
      byte[] arrayOfByte;
      if (paramBoolean)
      {
        if (str1.length() > 0)
          LogError(str1);
        ByteArrayOutputStream localByteArrayOutputStream = new ByteArrayOutputStream();
        PrintWriter localPrintWriter = new PrintWriter(localByteArrayOutputStream);
        paramThrowable.printStackTrace(localPrintWriter);
        localPrintWriter.close();
        arrayOfByte = localByteArrayOutputStream.toByteArray();
      }
      try
      {
        LogError(new String(arrayOfByte, "UTF8"));
        return str1;
        label194: str1 = str2 + " (java line: " + localStackTraceElement.getLineNumber() + ")";
      }
      catch (UnsupportedEncodingException localUnsupportedEncodingException)
      {
        localUnsupportedEncodingException.printStackTrace();
      }
    }
    return str1;
  }

  public static void runAsync(BA paramBA, Object paramObject, String paramString, Object[] paramArrayOfObject, Callable<Object[]> paramCallable)
  {
    submitRunnable(new Runnable(paramCallable, paramObject, paramBA, paramString.toLowerCase(cul), paramArrayOfObject)
    {
      public void run()
      {
        try
        {
          Object[] arrayOfObject2 = (Object[])BA.this.call();
          Object localObject2 = this.val$Sender;
          if ((this.val$Sender instanceof ObjectWrapper))
            localObject2 = ((ObjectWrapper)this.val$Sender).getObjectOrNull();
          this.val$ba.raiseEventFromDifferentThread(localObject2, null, 0, this.val$eventName, false, arrayOfObject2);
          return;
        }
        catch (Exception localException)
        {
          localException.printStackTrace();
          this.val$ba.setLastException(localException);
          Object localObject1 = this.val$Sender;
          if ((this.val$Sender instanceof ObjectWrapper))
            localObject1 = ((ObjectWrapper)this.val$Sender).getObjectOrNull();
          BA localBA = this.val$ba;
          String str = this.val$eventName;
          Object[] arrayOfObject1 = this.val$errorResult;
          localBA.raiseEventFromDifferentThread(localObject1, null, 0, str, false, arrayOfObject1);
        }
      }
    }
    , null, 0);
  }

  public static Future<?> submitRunnable(Runnable paramRunnable, Object paramObject, int paramInt)
  {
    if (threadPool == null)
      monitorenter;
    try
    {
      if (threadPool == null)
        threadPool = new B4AThreadPool();
      monitorexit;
      if ((paramObject instanceof ObjectWrapper))
        paramObject = ((ObjectWrapper)paramObject).getObject();
      threadPool.submit(paramRunnable, paramObject, paramInt);
      return null;
    }
    finally
    {
      monitorexit;
    }
    throw localObject;
  }

  public static int switchObjectToInt(Object paramObject, Object[] paramArrayOfObject)
  {
    double d;
    int j;
    if ((paramObject instanceof Number))
    {
      d = ((Number)paramObject).doubleValue();
      j = 0;
      if (j < paramArrayOfObject.length);
    }
    while (true)
    {
      return -1;
      if (d == ((Number)paramArrayOfObject[j]).doubleValue())
        return j;
      j++;
      break;
      for (int i = 0; i < paramArrayOfObject.length; i++)
        if (paramObject.equals(paramArrayOfObject[i]))
          return i;
    }
  }

  public void ShowErrorMsgbox(String paramString1, String paramString2)
  {
    this.sharedProcessBA.ignoreEventsFromOtherThreadsDuringMsgboxError = true;
    try
    {
      LogError(paramString1);
      AlertDialog.Builder localBuilder = new AlertDialog.Builder(((BA)this.sharedProcessBA.activityBA.get()).context);
      localBuilder.setTitle("Error occurred");
      String str;
      Msgbox.DialogResponse localDialogResponse;
      AlertDialog localAlertDialog;
      if (paramString2 != null)
      {
        str = "An error has occurred in sub:" + paramString2 + "\n";
        localBuilder.setMessage(str + paramString1 + "\nContinue?");
        localDialogResponse = new Msgbox.DialogResponse(false);
        localBuilder.setPositiveButton("Yes", localDialogResponse);
        localBuilder.setNegativeButton("No", localDialogResponse);
        localAlertDialog = localBuilder.create();
        if (this.sharedProcessBA.numberOfStackedEvents != 1)
          break label203;
      }
      label203: for (boolean bool = true; ; bool = false)
      {
        Msgbox.msgbox(localAlertDialog, bool);
        if (localDialogResponse.res == -2)
        {
          Process.killProcess(Process.myPid());
          System.exit(0);
        }
        return;
        str = "";
        break;
      }
    }
    finally
    {
      this.sharedProcessBA.ignoreEventsFromOtherThreadsDuringMsgboxError = false;
    }
    throw localObject;
  }

  public void addMessageToPausedMessageQueue(String paramString, Runnable paramRunnable)
  {
    if (this.processBA != null)
    {
      this.processBA.addMessageToPausedMessageQueue(paramString, paramRunnable);
      return;
    }
    Log("sending message to waiting queue (" + paramString + ")");
    if (this.sharedProcessBA.messagesDuringPaused == null)
      this.sharedProcessBA.messagesDuringPaused = new ArrayList();
    if (this.sharedProcessBA.messagesDuringPaused.size() > 20)
    {
      Log("Ignoring event (too many queued events: " + paramString + ")");
      return;
    }
    this.sharedProcessBA.messagesDuringPaused.add(paramRunnable);
  }

  public String getClassNameWithoutPackage()
  {
    return this.className.substring(1 + this.className.lastIndexOf("."));
  }

  public Exception getLastException()
  {
    if (this.processBA != null)
      return this.processBA.getLastException();
    return this.sharedProcessBA.lastException;
  }

  public Object getSender()
  {
    return senderHolder.get();
  }

  public boolean isActivityPaused()
  {
    if (this.processBA != null)
      return this.processBA.isActivityPaused();
    return this.sharedProcessBA.isActivityPaused;
  }

  public void loadHtSubs(Class<?> paramClass)
  {
    Method[] arrayOfMethod = paramClass.getDeclaredMethods();
    int i = arrayOfMethod.length;
    for (int j = 0; ; j++)
    {
      if (j >= i)
        return;
      Method localMethod = arrayOfMethod[j];
      if (!localMethod.getName().startsWith("_"))
        continue;
      this.htSubs.put(localMethod.getName().substring(1).toLowerCase(cul), localMethod);
    }
  }

  public void onActivityResult(int paramInt1, int paramInt2, Intent paramIntent)
  {
    WeakReference localWeakReference;
    if (this.sharedProcessBA.onActivityResultMap != null)
    {
      localWeakReference = (WeakReference)this.sharedProcessBA.onActivityResultMap.get(Integer.valueOf(paramInt1));
      if (localWeakReference == null)
        Log("onActivityResult: wi is null");
    }
    else
    {
      return;
    }
    this.sharedProcessBA.onActivityResultMap.remove(Integer.valueOf(paramInt1));
    IOnActivityResult localIOnActivityResult = (IOnActivityResult)localWeakReference.get();
    if (localIOnActivityResult == null)
    {
      Log("onActivityResult: IOnActivityResult was released");
      return;
    }
    addMessageToPausedMessageQueue("OnActivityResult", new Runnable(localIOnActivityResult, paramInt2, paramIntent)
    {
      public void run()
      {
        try
        {
          this.val$i.ResultArrived(this.val$result, this.val$intent);
          return;
        }
        catch (Exception localException)
        {
          localException.printStackTrace();
        }
      }
    });
  }

  public Object raiseEvent(Object paramObject, String paramString, Object[] paramArrayOfObject)
  {
    return raiseEvent2(paramObject, false, paramString, false, paramArrayOfObject);
  }

  // ERROR //
  public Object raiseEvent2(Object paramObject, boolean paramBoolean1, String paramString, boolean paramBoolean2, Object[] paramArrayOfObject)
  {
    // Byte code:
    //   0: iconst_1
    //   1: istore 6
    //   3: aload_0
    //   4: getfield 139	anywheresoftware/b4a/BA:processBA	Lanywheresoftware/b4a/BA;
    //   7: ifnull +18 -> 25
    //   10: aload_0
    //   11: getfield 139	anywheresoftware/b4a/BA:processBA	Lanywheresoftware/b4a/BA;
    //   14: aload_1
    //   15: iload_2
    //   16: aload_3
    //   17: iload 4
    //   19: aload 5
    //   21: invokevirtual 690	anywheresoftware/b4a/BA:raiseEvent2	(Ljava/lang/Object;ZLjava/lang/String;Z[Ljava/lang/Object;)Ljava/lang/Object;
    //   24: areturn
    //   25: aload_0
    //   26: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   29: getfield 649	anywheresoftware/b4a/BA$SharedProcessBA:isActivityPaused	Z
    //   32: ifeq +32 -> 64
    //   35: iload_2
    //   36: ifne +28 -> 64
    //   39: getstatic 698	java/lang/System:out	Ljava/io/PrintStream;
    //   42: new 287	java/lang/StringBuilder
    //   45: dup
    //   46: ldc_w 700
    //   49: invokespecial 370	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   52: aload_3
    //   53: invokevirtual 294	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   56: invokevirtual 312	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   59: invokevirtual 705	java/io/PrintStream:println	(Ljava/lang/String;)V
    //   62: aconst_null
    //   63: areturn
    //   64: aload_0
    //   65: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   68: astore 14
    //   70: aload 14
    //   72: iconst_1
    //   73: aload 14
    //   75: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   78: iadd
    //   79: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   82: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   85: aload_1
    //   86: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   89: aload_0
    //   90: getfield 135	anywheresoftware/b4a/BA:htSubs	Ljava/util/HashMap;
    //   93: aload_3
    //   94: invokevirtual 383	java/util/HashMap:get	(Ljava/lang/Object;)Ljava/lang/Object;
    //   97: checkcast 657	java/lang/reflect/Method
    //   100: astore 15
    //   102: aload 15
    //   104: ifnull +112 -> 216
    //   107: aload 15
    //   109: aload_0
    //   110: getfield 126	anywheresoftware/b4a/BA:eventsTarget	Ljava/lang/Object;
    //   113: aload 5
    //   115: invokevirtual 713	java/lang/reflect/Method:invoke	(Ljava/lang/Object;[Ljava/lang/Object;)Ljava/lang/Object;
    //   118: astore 18
    //   120: aload_0
    //   121: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   124: astore 19
    //   126: aload 19
    //   128: iconst_m1
    //   129: aload 19
    //   131: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   134: iadd
    //   135: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   138: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   141: aconst_null
    //   142: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   145: aload 18
    //   147: areturn
    //   148: astore 17
    //   150: new 273	java/lang/Exception
    //   153: dup
    //   154: new 287	java/lang/StringBuilder
    //   157: dup
    //   158: ldc_w 715
    //   161: invokespecial 370	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   164: aload_3
    //   165: invokevirtual 294	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   168: ldc_w 717
    //   171: invokevirtual 294	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   174: invokevirtual 312	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   177: invokespecial 718	java/lang/Exception:<init>	(Ljava/lang/String;)V
    //   180: athrow
    //   181: astore 13
    //   183: aload 13
    //   185: athrow
    //   186: astore 10
    //   188: aload_0
    //   189: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   192: astore 11
    //   194: aload 11
    //   196: iconst_m1
    //   197: aload 11
    //   199: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   202: iadd
    //   203: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   206: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   209: aconst_null
    //   210: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   213: aload 10
    //   215: athrow
    //   216: iload 4
    //   218: ifeq +203 -> 421
    //   221: new 273	java/lang/Exception
    //   224: dup
    //   225: new 287	java/lang/StringBuilder
    //   228: dup
    //   229: ldc_w 715
    //   232: invokespecial 370	java/lang/StringBuilder:<init>	(Ljava/lang/String;)V
    //   235: aload_3
    //   236: invokevirtual 294	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   239: ldc_w 720
    //   242: invokevirtual 294	java/lang/StringBuilder:append	(Ljava/lang/String;)Ljava/lang/StringBuilder;
    //   245: invokevirtual 312	java/lang/StringBuilder:toString	()Ljava/lang/String;
    //   248: invokespecial 718	java/lang/Exception:<init>	(Ljava/lang/String;)V
    //   251: athrow
    //   252: astore 7
    //   254: aload 7
    //   256: instanceof 722
    //   259: ifeq +10 -> 269
    //   262: aload 7
    //   264: invokevirtual 726	java/lang/Throwable:getCause	()Ljava/lang/Throwable;
    //   267: astore 7
    //   269: aload 7
    //   271: instanceof 692
    //   274: ifeq +57 -> 331
    //   277: aload_0
    //   278: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   281: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   284: iload 6
    //   286: if_icmple +9 -> 295
    //   289: aload 7
    //   291: checkcast 692	anywheresoftware/b4a/B4AUncaughtException
    //   294: athrow
    //   295: getstatic 698	java/lang/System:out	Ljava/io/PrintStream;
    //   298: ldc_w 728
    //   301: invokevirtual 705	java/io/PrintStream:println	(Ljava/lang/String;)V
    //   304: aload_0
    //   305: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   308: astore 12
    //   310: aload 12
    //   312: iconst_m1
    //   313: aload 12
    //   315: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   318: iadd
    //   319: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   322: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   325: aconst_null
    //   326: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   329: aconst_null
    //   330: areturn
    //   331: aload 7
    //   333: instanceof 730
    //   336: ifeq +9 -> 345
    //   339: aload 7
    //   341: checkcast 730	java/lang/Error
    //   344: athrow
    //   345: getstatic 58	anywheresoftware/b4a/BA:debugMode	Z
    //   348: ifeq +6 -> 354
    //   351: iconst_0
    //   352: istore 6
    //   354: aload 7
    //   356: iload 6
    //   358: invokestatic 732	anywheresoftware/b4a/BA:printException	(Ljava/lang/Throwable;Z)Ljava/lang/String;
    //   361: astore 8
    //   363: aload_0
    //   364: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   367: getfield 552	anywheresoftware/b4a/BA$SharedProcessBA:activityBA	Ljava/lang/ref/WeakReference;
    //   370: ifnonnull +13 -> 383
    //   373: new 456	java/lang/RuntimeException
    //   376: dup
    //   377: aload 7
    //   379: invokespecial 735	java/lang/RuntimeException:<init>	(Ljava/lang/Throwable;)V
    //   382: athrow
    //   383: aload_0
    //   384: aload 7
    //   386: invokevirtual 736	java/lang/Throwable:toString	()Ljava/lang/String;
    //   389: aload 8
    //   391: invokevirtual 738	anywheresoftware/b4a/BA:ShowErrorMsgbox	(Ljava/lang/String;Ljava/lang/String;)V
    //   394: aload_0
    //   395: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   398: astore 9
    //   400: aload 9
    //   402: iconst_m1
    //   403: aload 9
    //   405: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   408: iadd
    //   409: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   412: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   415: aconst_null
    //   416: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   419: aconst_null
    //   420: areturn
    //   421: aload_0
    //   422: getfield 148	anywheresoftware/b4a/BA:sharedProcessBA	Lanywheresoftware/b4a/BA$SharedProcessBA;
    //   425: astore 16
    //   427: aload 16
    //   429: iconst_m1
    //   430: aload 16
    //   432: getfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   435: iadd
    //   436: putfield 593	anywheresoftware/b4a/BA$SharedProcessBA:numberOfStackedEvents	I
    //   439: getstatic 81	anywheresoftware/b4a/BA:senderHolder	Ljava/lang/ThreadLocal;
    //   442: aconst_null
    //   443: invokevirtual 709	java/lang/ThreadLocal:set	(Ljava/lang/Object;)V
    //   446: aconst_null
    //   447: areturn
    //
    // Exception table:
    //   from	to	target	type
    //   107	120	148	java/lang/IllegalArgumentException
    //   64	102	181	anywheresoftware/b4a/B4AUncaughtException
    //   107	120	181	anywheresoftware/b4a/B4AUncaughtException
    //   150	181	181	anywheresoftware/b4a/B4AUncaughtException
    //   221	252	181	anywheresoftware/b4a/B4AUncaughtException
    //   64	102	186	finally
    //   107	120	186	finally
    //   150	181	186	finally
    //   183	186	186	finally
    //   221	252	186	finally
    //   254	269	186	finally
    //   269	295	186	finally
    //   295	304	186	finally
    //   331	345	186	finally
    //   345	351	186	finally
    //   354	383	186	finally
    //   383	394	186	finally
    //   64	102	252	java/lang/Throwable
    //   107	120	252	java/lang/Throwable
    //   150	181	252	java/lang/Throwable
    //   221	252	252	java/lang/Throwable
  }

  public Object raiseEventFromDifferentThread(Object paramObject1, Object paramObject2, int paramInt, String paramString, boolean paramBoolean, Object[] paramArrayOfObject)
  {
    if (this.processBA != null)
      return this.processBA.raiseEventFromDifferentThread(paramObject1, paramObject2, paramInt, paramString, paramBoolean, paramArrayOfObject);
    3 local3 = new B4ARunnable(paramString, paramObject2, paramInt, paramObject1, paramBoolean, paramArrayOfObject)
    {
      public void run()
      {
        if (BA.this.sharedProcessBA.ignoreEventsFromOtherThreadsDuringMsgboxError)
        {
          BA.Log("Event: " + this.val$event + ", was ignored.");
          return;
        }
        if ((!BA.this.sharedProcessBA.isService) && (BA.this.sharedProcessBA.activityBA == null))
        {
          BA.Log("Reposting event: " + this.val$event);
          BA.handler.post(this);
          return;
        }
        if (BA.this.sharedProcessBA.isActivityPaused)
        {
          if (BA.this.sharedProcessBA.isService)
          {
            BA.Log("Ignoring event as service was destroyed: " + this.val$event);
            return;
          }
          BA.this.addMessageToPausedMessageQueue(this.val$event, this);
          return;
        }
        if (this.val$container != null)
          BA.access$0(this.val$container, this.val$TaskId);
        BA.this.raiseEvent2(this.val$sender, false, this.val$event, this.val$throwErrorIfMissingSub, this.val$params);
      }
    };
    handler.post(local3);
    return null;
  }

  public void raiseEventFromUI(Object paramObject, String paramString, Object[] paramArrayOfObject)
  {
    if (this.processBA != null)
    {
      this.processBA.raiseEventFromUI(paramObject, paramString, paramArrayOfObject);
      return;
    }
    2 local2 = new B4ARunnable(paramString, paramObject, paramArrayOfObject)
    {
      public void run()
      {
        if (BA.this.sharedProcessBA.ignoreEventsFromOtherThreadsDuringMsgboxError)
        {
          BA.LogInfo("Event: " + this.val$event + ", was ignored.");
          return;
        }
        if ((!BA.this.sharedProcessBA.isService) && (BA.this.sharedProcessBA.activityBA == null))
        {
          BA.LogInfo("Reposting event: " + this.val$event);
          BA.handler.post(this);
          return;
        }
        if (BA.this.sharedProcessBA.isActivityPaused)
        {
          BA.LogInfo("Ignoring event: " + this.val$event);
          return;
        }
        BA.this.raiseEvent2(this.val$sender, false, this.val$event, false, this.val$params);
      }
    };
    handler.post(local2);
  }

  public boolean runHook(String paramString, Object paramObject, Object[] paramArrayOfObject)
  {
    if (subExists(paramString))
      try
      {
        Boolean localBoolean = (Boolean)((Method)this.htSubs.get(paramString)).invoke(paramObject, paramArrayOfObject);
        if (localBoolean != null)
        {
          boolean bool = localBoolean.booleanValue();
          if (bool)
            return true;
        }
        return false;
      }
      catch (Exception localException)
      {
        throw new RuntimeException(localException);
      }
    return false;
  }

  public void setActivityPaused(boolean paramBoolean)
  {
    if (this.processBA != null)
      this.processBA.setActivityPaused(paramBoolean);
    do
    {
      do
      {
        return;
        this.sharedProcessBA.isActivityPaused = paramBoolean;
      }
      while ((paramBoolean) || (this.sharedProcessBA.isService));
      if ((this.sharedProcessBA.messagesDuringPaused != null) || (uninitializedActivitiesMessagesDuringPaused == null))
        continue;
      String str = this.className;
      this.sharedProcessBA.messagesDuringPaused = ((ArrayList)uninitializedActivitiesMessagesDuringPaused.get(str));
      uninitializedActivitiesMessagesDuringPaused.remove(str);
    }
    while ((this.sharedProcessBA.messagesDuringPaused == null) || (this.sharedProcessBA.messagesDuringPaused.size() <= 0));
    try
    {
      Log("running waiting messages (" + this.sharedProcessBA.messagesDuringPaused.size() + ")");
      Iterator localIterator = this.sharedProcessBA.messagesDuringPaused.iterator();
      while (true)
      {
        boolean bool = localIterator.hasNext();
        if (!bool)
          return;
        Runnable localRunnable = (Runnable)localIterator.next();
        if ((localRunnable instanceof RaiseEventWhenFirstCreate))
          ((RaiseEventWhenFirstCreate)localRunnable).ba = this;
        localRunnable.run();
      }
    }
    finally
    {
      this.sharedProcessBA.messagesDuringPaused.clear();
    }
    throw localObject;
  }

  public void setLastException(Exception paramException)
  {
    while (true)
    {
      if ((paramException == null) || (paramException.getCause() == null) || (!(paramException instanceof Exception)))
      {
        this.sharedProcessBA.lastException = paramException;
        return;
      }
      paramException = (Exception)paramException.getCause();
    }
  }

  public void startActivityForResult(IOnActivityResult paramIOnActivityResult, Intent paramIntent)
  {
    monitorenter;
    try
    {
      if (this.processBA != null)
        this.processBA.startActivityForResult(paramIOnActivityResult, paramIntent);
      while (true)
      {
        return;
        if (this.sharedProcessBA.activityBA == null)
          continue;
        BA localBA = (BA)this.sharedProcessBA.activityBA.get();
        if (localBA == null)
          continue;
        if (this.sharedProcessBA.onActivityResultMap == null)
          this.sharedProcessBA.onActivityResultMap = new HashMap();
        this.sharedProcessBA.onActivityResultMap.put(Integer.valueOf(this.sharedProcessBA.onActivityResultCode), new WeakReference(paramIOnActivityResult));
        try
        {
          Activity localActivity = localBA.activity;
          SharedProcessBA localSharedProcessBA = this.sharedProcessBA;
          int i = localSharedProcessBA.onActivityResultCode;
          localSharedProcessBA.onActivityResultCode = (i + 1);
          localActivity.startActivityForResult(paramIntent, i);
        }
        catch (ActivityNotFoundException localActivityNotFoundException)
        {
          this.sharedProcessBA.onActivityResultMap.remove(Integer.valueOf(-1 + this.sharedProcessBA.onActivityResultCode));
          paramIOnActivityResult.ResultArrived(0, null);
        }
      }
    }
    finally
    {
      monitorexit;
    }
    throw localObject;
  }

  public boolean subExists(String paramString)
  {
    if (this.processBA != null)
      return this.processBA.subExists(paramString);
    return this.htSubs.containsKey(paramString);
  }

  public static @interface ActivityObject
  {
  }

  @Retention(RetentionPolicy.RUNTIME)
  public static @interface Author
  {
    public abstract String value();
  }

  public static abstract interface B4ARunnable extends Runnable
  {
  }

  public static abstract interface B4aDebuggable
  {
    public abstract Object[] debug(int paramInt, boolean[] paramArrayOfBoolean);
  }

  public static abstract interface CheckForReinitialize
  {
    public abstract boolean IsInitialized();
  }

  @Retention(RetentionPolicy.SOURCE)
  @Target({java.lang.annotation.ElementType.TYPE})
  public static @interface DependsOn
  {
    public abstract String[] values();
  }

  public static @interface DesignerName
  {
    public abstract String value();
  }

  @Retention(RetentionPolicy.SOURCE)
  @Target({java.lang.annotation.ElementType.TYPE})
  public static @interface DontInheritEvents
  {
  }

  @Retention(RetentionPolicy.SOURCE)
  @Target({java.lang.annotation.ElementType.TYPE})
  public static @interface Events
  {
    public abstract String[] values();
  }

  public static @interface Hide
  {
  }

  public static abstract interface IBridgeLog
  {
    public abstract void offer(String paramString);
  }

  public static abstract interface IterableList
  {
    public abstract Object Get(int paramInt);

    public abstract int getSize();
  }

  @Retention(RetentionPolicy.SOURCE)
  public static @interface Permissions
  {
    public abstract String[] values();
  }

  public static @interface Pixel
  {
  }

  private static class RaiseEventWhenFirstCreate
    implements Runnable
  {
    Object[] arguments;
    BA ba;
    String eventName;

    public void run()
    {
      this.ba.raiseEvent2(null, true, this.eventName, true, this.arguments);
    }
  }

  @Target({java.lang.annotation.ElementType.METHOD})
  public static @interface RaisesSynchronousEvents
  {
  }

  public static class SharedProcessBA
  {
    public WeakReference<BA> activityBA;
    boolean ignoreEventsFromOtherThreadsDuringMsgboxError = false;
    volatile boolean isActivityPaused = true;
    public final boolean isService;
    Exception lastException = null;
    ArrayList<Runnable> messagesDuringPaused;
    int numberOfStackedEvents = 0;
    int onActivityResultCode = 1;
    HashMap<Integer, WeakReference<IOnActivityResult>> onActivityResultMap;
    public Object sender;

    public SharedProcessBA(boolean paramBoolean)
    {
      this.isService = paramBoolean;
    }
  }

  @Retention(RetentionPolicy.RUNTIME)
  public static @interface ShortName
  {
    public abstract String value();
  }

  public static abstract interface SubDelegator
  {
    public static final Object SubNotFound = new Object();

    public abstract Object callSub(String paramString, Object paramObject, Object[] paramArrayOfObject)
      throws Exception;
  }

  @Retention(RetentionPolicy.RUNTIME)
  public static @interface Version
  {
    public abstract float value();
  }

  public static abstract class WarningEngine
  {
    public static final int FULLSCREEN_MISMATCH = 1004;
    public static final int OBJECT_ALREADY_INITIALIZED = 1003;
    public static final int SAME_OBJECT_ADDED_TO_LIST = 1002;
    public static final int ZERO_SIZE_PANEL = 1001;

    public static void warn(int paramInt)
    {
      if (BA.warningEngine != null)
        BA.warningEngine.warnImpl(paramInt);
    }

    public abstract void checkFullScreenInLayout(boolean paramBoolean1, boolean paramBoolean2);

    protected abstract void warnImpl(int paramInt);
  }
}

/* Location:           F:\android\extract\dex2jar-0.0.9.15\dex2jar-0.0.9.15\classes_dex2jar.jar
 * Qualified Name:     anywheresoftware.b4a.BA
 * JD-Core Version:    0.6.0
 */
