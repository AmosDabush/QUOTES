"""
# windows addon - add a system notification tesk with quotes from quote-me
# to windows tesk-scheduler with schtasks.
# login with key (key is genrated form the site).
# options for any custom time,date and intrvel time and more trigger options.
# page 1 - login.
# page 2 - tesk maneger.
# page 3 - help and info.
"""  
from tkinter import *
import pickle
import os
import urllib.request
from pathlib import Path
import ctypes

try:
    import tkinter as tk
    from tkinter import ttk
except ImportError:
    import Tkinter as tk
    import ttk
from tkinter import messagebox
# import tkcalendar
from tkcalendar import DateEntry

class SampleApp(tk.Tk):
    key=""
    def __init__(self):
        tk.Tk.__init__(self)
        self._frame = None
        self.switch_frame(StartPage)
        print(ctypes.windll.shell32.IsUserAnAdmin())
        if(ctypes.windll.shell32.IsUserAnAdmin()==0):
            messagebox.showinfo("missing info", "Please run this app as administrator")
            self.switch_frame(PageUacErr)
            # return
    def switch_frame(self, frame_class):
        """Destroys current frame and replaces it with a new one."""
        new_frame = frame_class(self)
        if self._frame is not None:
            self._frame.destroy()
        self._frame = new_frame
        self._frame.pack()



# login page
class StartPage(tk.Frame):
    def __init__(self, master):

        def on_entry_click(event):
            """function that gets called whenever entry is clicked"""
            if keyInput.get() == 'Enter your add-on key here...':
                keyInput.delete(0, "end")  # delete all the text in the entry
                keyInput.insert(0, '')  # Insert blank for user input
                keyInput.config(fg='black')
        def on_focusout(event):
            if keyInput.get() == '':
                keyInput.insert(0, 'Enter your add-on key here...')
                keyInput.config(fg='grey')

        def logIn():
            lbl.config(text="contcting please wait...", foreground="blue")
            key = keyInput.get()
            url_appN = "https://us-central1-quote-me-d966f.cloudfunctions.net/appN/" + key
            print(url_appN)
            try:
                req = urllib.request.urlopen(url_appN)
                print("res code")
                print(req.getcode())
                print("res read()")
                id = str(req.read())
                mylist = id.split("'")
                id = mylist[1]
                print("AppId: " + id)
                PageOne.PageOneKey =  id
                print(req.read())
                master.switch_frame(PageOne)
                # prints the int of the status code.)
            except urllib.error.URLError as e:
                 print(e.reason)
                 lbl.config(text="worng key!",foreground="red")


        # init login page
        tk.Frame.__init__(self, master,bg="#FFFFFF")
        Label(self, text="Enter Key :",bg='#FFFFFF').grid(row=2,column=0,sticky=W, pady=4,padx=4)
        lbl = Label(self, text=" Please log in...",bg='#FFFFFF',fg="green")
        lbl.grid(row=4,sticky=W,column=1)
        tk.Label(self, text="Quote-Me Add-On",bg='#FFFFFF',fg="#0080FF").grid(row=0, column=1, sticky=W, pady=4,padx=4)
        keyInput = Entry(self)
        keyInput.insert(0, 'Enter your add-on key here...')
        keyInput.bind('<FocusIn>', on_entry_click)
        keyInput.bind('<FocusOut>', on_focusout)
        keyInput.config(fg='grey')
        keyInput.grid(row=1, column=1, sticky=W, pady=4, padx=4)
        keyInput.grid(row=2, column=1,sticky=W, pady=4,padx=4)
        ttk.Button(self, text='Quit', command=master.destroy).grid(row=15, column=2, sticky=W, pady=4,padx=4)
        ttk.Button(self, text='logIn', command=logIn).grid(row=2, column=2, sticky=W, pady=4,padx=4)
        # ttk.Button(self, text="page one",command=lambda: master.switch_frame(PageOne)).grid(row=15, column=0, sticky=W, pady=4,padx=4)
        ttk.Button(self, text="help?",command=lambda: master.switch_frame(PageTwo)).grid(row=15, column=1, sticky=W, pady=4,padx=30)

# main page
class PageOne(tk.Frame):
    PageOneKey="0"
    def __init__(self, master):

        def create_task():
            print("-= start =-")
            os.system(cmd)
            print(cmd)
            print("-= end =-")

        def create_task_once(taskname,date,hour,minute):
            tn=taskname.replace(" ", "")
            d=str(date).replace("-", "/")
            h=hour
            m=minute
            if (tn=='Entertaskname...' or tn==''):
                messagebox.showinfo("missing info", "Please select task name")
                return
            if (cb.current()== -1 or int(h)<0 or int(h)>23):
                messagebox.showinfo("missing info", "Please select right hour")
                return
            if (cb2.current() == -1 or int(m)<0 or int(m)>59):
                messagebox.showinfo("missing info", "Please select right minute")
                return
            cmd1 = 'SchTasks /Create /SC ONCE /TN ' + tn + ' /TR "powershell -windowstyle hidden  Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1"  /ST ' +h+':'+m+ ' /SD 01/01/2020 /F'
            print(cmd1)
            print("-= start =-")
            l = tn
            with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                except EOFError:
                    b = list()  # task file is empty

                if any(tn in s for s in b):
                    print(tn+" is allrady in list")
                else:
                    b.append(l)
                    b.sort()
                    cbremove['values']= b

            with open("qmtasks.txt", "wb") as fp:  # Pickling
                b.sort()
                pickle.dump(b, fp)
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
              b = pickle.load(fp)
              print(b)
            os.system(cmd1)
            task1Input.delete(0, "end")  # delete all the text in the entry
            task1Input.insert(0, '')  # Insert blank for user input
            print(cmd1)
            messagebox.showinfo("Success", tn+" added to task scheduler")
            print("-= end =-")

        def create_task_daily():
            tn=task1Input_daily.get().replace(" ", "")
            h= cb_daily.get()
            m= cb2_daily.get()
            if (tn=='Entertaskname...' or tn==''):
                messagebox.showinfo("missing info", "Please select task name")
                return
            if (cb_daily.current()== -1 or int(h)<0 or int(h)>23):
                messagebox.showinfo("missing info", "Please select right hour")
                return
            if (cb2_daily.current() == -1 or int(m)<0 or int(m)>59):
                messagebox.showinfo("missing info", "Please select right minute")
                return
            cmd1 = 'SchTasks /Create /SC DAILY /TN ' + taskName + ' /TR "powershell -windowstyle hidden  Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1"  /ST  ' +h+':'+m+ ' /F'
            print(cmd1)
            print("-= start =-")
            l = tn
            with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                except EOFError:
                    b = list()  # task file is empty
                if any(tn in s for s in b):
                    print(tn+" is allrady in list")
                else:
                    b.append(l)
                    b.sort()
                    cbremove['values']= b
            with open("qmtasks.txt", "wb") as fp:  # Pickling
                b.sort()
                pickle.dump(b, fp)
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
              b = pickle.load(fp)
              print(b)
            os.system(cmd1)
            task1Input_daily.delete(0, "end")  # delete all the text in the entry
            task1Input_daily.insert(0, '')  # Insert blank for user input
            print(cmd1)
            messagebox.showinfo("Success", tn+" added to task scheduler")
            print("-= end =-")

        def create_task_idle():
            tn=task1Input_idle.get().replace(" ", "")
            h= cb_idle.get()
            if (tn=='Entertaskname...' or tn==''):
                messagebox.showinfo("missing info", "Please select task name")
                return
            if ( cb_idle.current()== -1 or int(h)<0 or int(h)>23):
                messagebox.showinfo("missing info", "Please select right idle time (number)")
                return
            cmd1 = 'SchTasks /Create  /SC ONIDLE /TN ' + tn + ' /TR "powershell -windowstyle hidden Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1" /I ' +h+ ' /F'
            print(cmd1)
            print("-= start =-")
            l = tn
            with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                except EOFError:
                    b = list()  # task file is empty

                if any(tn in s for s in b):
                    print(tn+" is allrady in list")
                else:
                    b.append(l)
                    b.sort()
                    cbremove['values']= b
            with open("qmtasks.txt", "wb") as fp:  # Pickling
                b.sort()
                pickle.dump(b, fp)
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
              b = pickle.load(fp)
              print(b)
            os.system(cmd1)
            task1Input_idle.delete(0, "end")  # delete all the text in the entry
            task1Input_idle.insert(0, '')  # Insert blank for user input
            print(cmd1)
            messagebox.showinfo("Success", tn+" added to task scheduler")
            print("-= end =-")

        def create_task_logon():
                tn=task1Input_logon.get().replace(" ", "")
                if (tn=='Entertaskname...' or tn==''):
                    messagebox.showinfo("missing info", "Please select task name")
                    return
                cmd1 = 'SchTasks /Create  /SC ONLOGON /TN ' + tn + ' /TR "powershell -windowstyle hidden Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1" /F'
                print(cmd1)
                print("-= start =-")
                l = tn
                with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                    unpickler = pickle.Unpickler(fp)
                    try:
                        b = unpickler.load()
                    except EOFError:
                        b = list()  # task file is empty

                    if any(tn in s for s in b):
                        print(tn+" is allrady in list")
                    else:
                        b.append(l)
                        b.sort()
                        cbremove['values']= b
                with open("qmtasks.txt", "wb") as fp:  # Pickling
                    b.sort()
                    pickle.dump(b, fp)
                with open("qmtasks.txt", "rb") as fp:  # Unpickling
                  b = pickle.load(fp)
                  print(b)
                os.system(cmd1)
                task1Input_logon.delete(0, "end")  # delete all the text in the entry
                task1Input_logon.insert(0, '')  # Insert blank for user input
                print(cmd1)
                messagebox.showinfo("Success", tn+" added to task scheduler")
                print("-= end =-")
        def create_task_sys():
                tn=task1Input_sysstart.get().replace(" ", "")
                if (tn=='Entertaskname...' or tn==''):
                    messagebox.showinfo("missing info", "Please select task name")
                    return

                cmd1 = 'SchTasks /Create  /SC ONSTART /TN ' + tn + ' /TR "powershell -windowstyle hidden Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1" /F'
                print(cmd1)
                print("-= start =-")
                l = tn
                with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                    unpickler = pickle.Unpickler(fp)
                    try:
                        b = unpickler.load()
                    except EOFError:
                        b = list()  # task file is empty

                    if any(tn in s for s in b):
                        print(tn+" is allrady in list")
                    else:
                        b.append(l)
                        b.sort()
                        cbremove['values']= b
                with open("qmtasks.txt", "wb") as fp:  # Pickling
                    b.sort()
                    pickle.dump(b, fp)
                with open("qmtasks.txt", "rb") as fp:  # Unpickling
                  b = pickle.load(fp)
                  print(b)
                os.system(cmd1)
                task1Input_sysstart.delete(0, "end")  # delete all the text in the entry
                task1Input_sysstart.insert(0, '')  # Insert blank for user input
                print(cmd1)
                messagebox.showinfo("Success", tn+" added to task scheduler")
                print("-= end =-")


        def create_task_monthly():
            tn=task1Input_monthly.get().replace(" ", "")
            h= cb_monthly.get()
            m= cb2_monthly.get()
            d= cb3_monthly.get()

            if (tn=='Entertaskname...' or tn==''):
                messagebox.showinfo("missing info", "Please select task name")
                return
            if (cb3_monthly.current() == -1 or int(d) < 0 or int(d) > 31):
                messagebox.showinfo("missing info", "Please select right hour")
                return
            if (cb_monthly.current()== -1 or int(h)<0 or int(h)>23):
                messagebox.showinfo("missing info", "Please select right hour")
                return
            if (cb2_monthly.current() == -1 or int(m)<0 or int(m)>59):
                messagebox.showinfo("missing info", "Please select right minute")
                return
            cmd1 = 'SchTasks /Create /SC MONTHLY /D '+d+' /TN ' + taskName + ' /TR "powershell -windowstyle hidden  Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1" /ST  ' +h+':'+m+ ' /F'

            print(cmd1)
            print("-= start =-")
            l = tn
            with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                except EOFError:
                    b = list()  # task file is empty

                if any(tn in s for s in b):
                    print(tn+" is allrady in list")
                else:
                    b.append(l)
                    b.sort()
                    cbremove['values']= b
            with open("qmtasks.txt", "wb") as fp:  # Pickling
                b.sort()
                pickle.dump(b, fp)
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
              b = pickle.load(fp)
              print(b)
            os.system(cmd1)
            task1Input_monthly.delete(0, "end")  # delete all the text in the entry
            task1Input_monthly.insert(0, '')  # Insert blank for user input
            print(cmd1)
            messagebox.showinfo("Success", tn+" added to task scheduler")
            print("-= end =-")

        def create_task_weekly():
            tn=task1Input_weekly.get().replace(" ", "")
            h= cb_weekly.get()
            m= cb2_weekly.get()
            d= cb3_weekly.get()

            if (tn=='Entertaskname...' or tn==''):
                messagebox.showinfo("missing info", "Please select task name")
                return
            if (cb3_weekly.current() == -1 ):
                messagebox.showinfo("missing info", "Please select right day")
                return
            if (cb_weekly.current()== -1 or int(h)<0 or int(h)>23):
                messagebox.showinfo("missing info", "Please select right hour")
                return
            if (cb2_weekly.current() == -1 or int(m)<0 or int(m)>59):
                messagebox.showinfo("missing info", "Please select right minute")
                return
            cmd1 = 'SchTasks /Create /SC WEEKLY /D '+d+' /TN  ' + taskName + ' /TR "powershell -windowstyle hidden  Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1" /ST  ' +h+':'+m+ ' /F'
            print(cmd1)
            print("-= start WEEKLY =-")
            l = tn
            with open("qmtasks.txt", "rb") as fp:  # Unpickling+append new task
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                except EOFError:
                    b = list()  # task file is empty

                if any(tn in s for s in b):
                    print(tn+" is allrady in list")
                else:
                    b.append(l)
                    b.sort()
                    cbremove['values']= b
            with open("qmtasks.txt", "wb") as fp:  # Pickling
                b.sort()
                pickle.dump(b, fp)
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
              b = pickle.load(fp)
              print(b)
            os.system(cmd1)
            task1Input_weekly.delete(0, "end")  # delete all the text in the entry
            task1Input_weekly.insert(0, '')  # Insert blank for user input
            print(cmd1)
            messagebox.showinfo("Success", tn+" added to task scheduler")
            print("-= end =-")


        def remove_task():
            tn=cbremove.get()
            delete = 'SchTasks /Delete /TN ' + tn + ' /F'
            print("-=remove_task start =-")
            with open("qmtasks.txt", "rb") as fp:  # Unpickling
                unpickler = pickle.Unpickler(fp)
                try:
                    b = unpickler.load()
                    b.remove(tn)
                except EOFError:
                    b = list()  # or whatever you want
                print(b)
            with open("qmtasks.txt", "wb") as fp:  # Unpickling
                try:
                    b.sort()
                    pickle.dump(b, fp)
                    cbremove['values']=b
                    cbremove.current(0)

                except EOFError:
                   print("EOFError")  # or whatever you want
                print(b)



            os.system(delete)
            print(delete)
            print("-= remove_task end =-")

# /**------------= entry clicks functions START =--------------*/
        def on_entry_click(event):
            """function that gets called whenever entry is clicked"""
            if task1Input.get() == 'Enter task name...':
                task1Input.delete(0, "end")  # delete all the text in the entry
                task1Input.insert(0, '')  # Insert blank for user input
                task1Input.config(fg='black')
        def on_entry_click2(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_daily.get() == 'Enter task name...':
                task1Input_daily.delete(0, "end")  # delete all the text in the entry
                task1Input_daily.insert(0, '')  # Insert blank for user input
                task1Input_daily.config(fg='black')
        def on_entry_click3(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_idle.get() == 'Enter task name...':
                task1Input_idle.delete(0, "end")  # delete all the text in the entry
                task1Input_idle.insert(0, '')  # Insert blank for user input
                task1Input_idle.config(fg='black')
        def on_focusout(event):
            if task1Input.get() == "":
                task1Input.insert(0, 'Enter task name...')
                task1Input.config(fg='grey')
        def on_focusout2(event):
            if task1Input_daily.get() == "":
                task1Input_daily.insert(0, 'Enter task name...')
                task1Input_daily.config(fg='grey')
        def on_focusout3(event):
            if task1Input_idle.get() == "":
                task1Input_idle.insert(0, 'Enter task name...')
                task1Input_idle.config(fg='grey')
        def on_entry_click4(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_monthly.get() == 'Enter task name...':
                task1Input_monthly.delete(0, "end")  # delete all the text in the entry
                task1Input_monthly.insert(0, '')  # Insert blank for user input
                task1Input_monthly.config(fg='black')
        def on_focusout4(event):
            if task1Input_monthly.get() == "":
                task1Input_monthly.insert(0, 'Enter task name...')
                task1Input_monthly.config(fg='grey')
        def on_entry_click5(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_monthly.get() == 'Enter task name...':
                task1Input_weekly.delete(0, "end")  # delete all the text in the entry
                task1Input_weekly.insert(0, '')  # Insert blank for user input
                task1Input_weekly.config(fg='black')
        def on_focusout5(event):
            if task1Input_weekly.get() == "":
                task1Input_weekly.insert(0, 'Enter task name...')
                task1Input_weekly.config(fg='grey')

        def on_entry_click6(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_logon.get() == 'Enter task name...':
                task1Input_logon.delete(0, "end")  # delete all the text in the entry
                task1Input_logon.insert(0, '')  # Insert blank for user input
                task1Input_logon.config(fg='black')

        def on_entry_click7(event):
            """function that gets called whenever entry is clicked"""
            if task1Input_monthly.get() == 'Enter task name...':
                task1Input_sysstart.delete(0, "end")  # delete all the text in the entry
                task1Input_sysstart.insert(0, '')  # Insert blank for user input
                task1Input_sysstart.config(fg='black')

        def on_focusout6(event):
                if task1Input_logon.get() == "":
                    task1Input_logon.insert(0, 'Enter task name...')
                    task1Input_logon.config(fg='grey')

        def on_focusout7(event):
                if task1Input_sysstart.get() == "":
                    task1Input_sysstart.insert(0, 'Enter task name...')
                    task1Input_sysstart.config(fg='grey')
# /**------------= entry clicks functions END =--------------*/
        def print_sel():
            print("name: ")
            print(task1Input.get())
            print("date: ")
            print(cal.get_date())
            print("hour: ")
            print(cb.get())
            print("minute: ")
            print(cb2.get())
            create_task_once(task1Input.get(),cal.get_date(), cb.get(), cb2.get())

        tk.Frame.__init__(self, master,bg="#FFFFFF")
        # headline
        Label(self, text="Quote-Me Add-On" , fg="#0080FF",bg="#FFFFFF").grid(row=0, column=2, sticky=E, pady=4,padx=4)

# ----------otion1 start once by date and time  ---------

        Label(self, text="One time notifications by date:",bg="#FFFFFF").grid(sticky=W,row=1, column=0)
        # task name input
        task1Input = Entry(self)
        task1Input.insert(0, 'Enter task name...')
        task1Input.bind('<FocusIn>', on_entry_click)
        task1Input.bind('<FocusOut>', on_focusout)
        task1Input.config(fg='grey')
        task1Input.grid(row=1, column=1, sticky=W, pady=4, padx=4)

        # date picker
        cal = DateEntry(self, width=12, background='darkblue', foreground='white', borderwidth=2)
        cal.grid(row=1, column=2,sticky=W, pady=4, padx=4)

        # Combobox hours and minute
        cb = ttk.Combobox(self,textvariable=StringVar(), height=9)
        cb.set('select hour')
        l1=['00','01','02','03','04','05','06','07','08','09']
        l2=["%d" % (i) for i in range(10,24)]
        cb['values']=l1+l2
        # ["%d" % (i) for i in range(10,24)]
        cb.grid(row=1,sticky=W, pady=4, padx=4, column=3)
        cb2 = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb2.set('select Minute')
        l1 = ['00','01', '02', '03', '04', '05', '06', '07', '08', '09']
        cb2['values'] = l1+["%d" %(i) for i in range(10,60)]
        cb2.grid(row=1, column=4, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=print_sel).grid( row=1, column=5, sticky=W, pady=4, padx=4)
        # cb.bind('<<ComboboxSelected>>', foo)  # binding of user selection with a custom callback
# ----------otion1 end ---------


# ----------otion2 start MONTHLY   ---------
        Label(self, text="Monthly notification:",bg="#FFFFFF").grid(row=2, column=0,sticky=W)
        # task name input
        task1Input_monthly = Entry(self)
        task1Input_monthly.insert(0, 'Enter task name...')
        task1Input_monthly.bind('<FocusIn>', on_entry_click4)
        task1Input_monthly.bind('<FocusOut>', on_focusout4)
        task1Input_monthly.config(fg='grey')
        task1Input_monthly.grid(row=2, column=1, sticky=W, pady=4, padx=4)

        # Combobox hours and minute
        cb_monthly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb_monthly.set('select hour')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        l2 = ["%d" % (i) for i in range(10, 24)]
        cb_monthly['values'] = l1 + l2
        # ["%d" % (i) for i in range(10,24)]
        cb_monthly.grid(row=2,sticky=W, pady=4, padx=4, column=3)
        cb2_monthly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb2_monthly.set('select Minute')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        cb2_monthly['values'] = l1 + ["%d" % (i) for i in range(10, 60)]
        cb2_monthly.grid(row=2, column=4, sticky=W, pady=4, padx=4)
        cb3_monthly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb3_monthly.set('select day')
        cb3_monthly['values'] = ["%d" % (i) for i in range(1, 32)]
        cb3_monthly.grid(row=2, column=2, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=create_task_monthly).grid(row=2, column=5, sticky=W, pady=4, padx=4)
        # cb.bind('<<ComboboxSelected>>', foo)  # binding of user selection with a custom callback
# ----------otion2 end ---------

# ----------otion3 start weekly   ---------
        Label(self, text="Weekly notification:",bg="#FFFFFF").grid(sticky=W,row=3, column=0)
        # task name input
        task1Input_weekly = Entry(self)
        task1Input_weekly.insert(0, 'Enter task name...')
        task1Input_weekly.bind('<FocusIn>', on_entry_click5)
        task1Input_weekly.bind('<FocusOut>', on_focusout5)
        task1Input_weekly.config(fg='grey')
        task1Input_weekly.grid(row=3, column=1, sticky=W, pady=4, padx=4)

        # Combobox hours and minute
        cb_weekly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb_weekly.set('select hour')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        l2 = ["%d" % (i) for i in range(10, 24)]
        cb_weekly['values'] = l1 + l2
        cb_weekly.grid(row=3,sticky=W, pady=4, padx=4,column=3)
        cb2_weekly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb2_weekly.set('select Minute')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        cb2_weekly['values'] = l1 + ["%d" % (i) for i in range(10, 60)]
        cb2_weekly.grid(row=3, column=4, sticky=W, pady=4, padx=4)
        cb3_weekly = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb3_weekly.set('select day')
        cb3_weekly['values'] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
        cb3_weekly.grid(row=3, column=2, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=create_task_weekly).grid(row=3, column=5, sticky=W, pady=4, padx=4)
# ----------otion3 end ---------

# ----------otion4 start daily by time  ---------
        Label(self, text="Daily notification:",bg="#FFFFFF").grid(sticky=W,row=4, column=0)
        # task name input
        task1Input_daily = Entry(self)
        task1Input_daily.insert(0, 'Enter task name...')
        task1Input_daily.bind('<FocusIn>', on_entry_click2)
        task1Input_daily.bind('<FocusOut>', on_focusout2)
        task1Input_daily.config(fg='grey')
        task1Input_daily.grid(row=4, column=1, sticky=W, pady=4, padx=4)

        cb_daily = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb_daily.set('select hour')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        l2 = ["%d" % (i) for i in range(10, 24)]
        cb_daily['values'] = l1 + l2
        cb_daily.grid(sticky=W, pady=4, padx=4,row=4, column=2)
        cb2_daily = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb2_daily.set('select Minute')
        l1 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09']
        cb2_daily['values'] = l1 + ["%d" % (i) for i in range(10, 60)]
        cb2_daily.grid(row=4, column=3, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=create_task_daily).grid(row=4, column=4, sticky=W, pady=4, padx=4)
# ----------otion4 end ---------

# ----------otion5 start idle by idle time  ---------
        Label(self, text="Idle notification:",bg="#FFFFFF").grid(sticky=W,row=5, column=0)
        # task name input
        task1Input_idle = Entry(self)
        task1Input_idle.insert(0, 'Enter task name...')
        task1Input_idle.bind('<FocusIn>', on_entry_click3)
        task1Input_idle.bind('<FocusOut>', on_focusout3)
        task1Input_idle.config(fg='grey')
        task1Input_idle.grid(row=5, column=1, sticky=W, pady=4, padx=4)

        # Combobox hours and minute
        cb_idle = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cb_idle.set('select idle time (sec)')
        l2 = ["%d" % (i) for i in range(1, 999)]
        cb_idle['values'] = l2
        cb_idle.grid(row=5,sticky=W, pady=4, padx=4,column=2)
        ttk.Button(self, text="Add", command=create_task_idle).grid(row=5, column=3, sticky=W, pady=4, padx=4)
# ----------otion5 end ---------


# ----------otion6 start logon by idle time  ---------
        Label(self, text="logon notification:", bg="#FFFFFF").grid(sticky=W, row=6, column=0)
        # task name input
        task1Input_logon = Entry(self)
        task1Input_logon.insert(0, 'Enter task name...')
        task1Input_logon.bind('<FocusIn>', on_entry_click6)
        task1Input_logon.bind('<FocusOut>', on_focusout6)
        task1Input_logon.config(fg='grey')
        task1Input_logon.grid(row=6, column=1, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=create_task_logon).grid(row=6, column=2, sticky=W, pady=4, padx=4)
# ----------otion6 end ---------

# ----------otion7 start at system startup by idle time  ---------
        Label(self, text="system startup notification:", bg="#FFFFFF").grid(sticky=W, row=7, column=0)
        # task name input
        task1Input_sysstart = Entry(self)
        task1Input_sysstart.insert(0, 'Enter task name...')
        task1Input_sysstart.bind('<FocusIn>', on_entry_click7)
        task1Input_sysstart.bind('<FocusOut>', on_focusout7)
        task1Input_sysstart.config(fg='grey')
        task1Input_sysstart.grid(row=7, column=1, sticky=W, pady=4, padx=4)
        ttk.Button(self, text="Add", command=create_task_sys).grid(row=7, column=2, sticky=W, pady=4, padx=4)
# ----------otion7 end ---------

# ----------= otion8 START - remove-task test  =---------

        my_file = Path("qmtasks.txt")
        if not my_file.is_file():
            print("exist")
            with open("qmtasks.txt", "w+") as fp:  # Unpickling
                unpickler = pickle.Unpickler(fp)

        with open("qmtasks.txt", "rb") as fp:  # Unpickling

            unpickler = pickle.Unpickler(fp)
            try:
                b = unpickler.load()
            except EOFError:
                b = list()  # or whatever you want
            print(b)
            tasks=b

        Label(self, text="Remove tasks:",bg="#FFFFFF").grid(sticky=W,row=8, column=0)
        cbremove = ttk.Combobox(self, textvariable=StringVar(), height=9)
        cbremove.set('select task')
        tasks.sort()
        cbremove['values'] = tasks
        cbremove.grid(row=8,sticky=W, column=1)
        ttk.Button(self, text="remove-task",command=remove_task).grid(row=8, column=2, sticky=W, pady=4,padx=4)
# ----------= otion8 END - remove-task test  =---------

        ttk.Button(self, text="Log-Out",command=lambda: master.switch_frame(StartPage)).grid(row=16, column=0, sticky=W, pady=4,padx=4)
        ttk.Button(self, text="help?",command=lambda: master.switch_frame(PageTwo)).grid(row=16, column=4, sticky=E, pady=4,padx=4)
        ttk.Button(self, text="exit",command=master.destroy).grid(row=16, column=5, sticky=W, pady=4,padx=4)

        taskName = "pythTestTesk3"
        url_app = "https://us-central1-quote-me-d966f.cloudfunctions.net/app/" + PageOne.PageOneKey
        cmd = 'SchTasks /Create /SC ONCE /TN ' + taskName + ' /TR "powershell -windowstyle hidden  Invoke-WebRequest -Uri ' + url_app + ' -TimeoutSec 1"  /ST 09:33  /SD 06/06/2026 /F'
        print(cmd)

# task maneger
class PageTwo(tk.Frame):
    def __init__(self, master):
        tk.Frame.__init__(self, master,bg="#FFFFFF")

        page_2_label = tk.Label(self,bg="#FFFFFF" ,text="Help page :")
        page_2_label2 = tk.Label(self,bg="#FFFFFF" ,text="this is a notification add-on "
                                                         "\nyou can select custom triggers for notification from quote-me"
                                                         "\n  ")

        start_button = ttk.Button(self,text="Go Back",
                                 command=lambda: master.switch_frame(StartPage))
        page_2_label.pack(side="top", fill="x")
        page_2_label2.pack(side="top", fill="y")
        tk.Label(self, bg="#FFFFFF", text="You can get login key trow the site").pack()
        tk.Label(self, bg="#FFFFFF", text="").pack()
        tk.Label(self, bg="#FFFFFF", text="option 1 : once by date and time").pack()
        tk.Label(self, bg="#FFFFFF", text="option 2 : Monthly by day (1-31) and time").pack()
        tk.Label(self, bg="#FFFFFF", text="option 3 : Weekly by day (week-days) and time").pack()
        tk.Label(self, bg="#FFFFFF", text="option 4 : Daily by time").pack()
        tk.Label(self, bg="#FFFFFF", text="option 5 : Idle while pc is in idle mode by idle time").pack()
        tk.Label(self, bg="#FFFFFF", text="option 6 : logon (in windows logon)").pack()
        tk.Label(self, bg="#FFFFFF", text="option 7 : system startup (in windows startup)").pack()
        tk.Label(self, bg="#FFFFFF", text="option 8 : Remove task by task name").pack()
        tk.Label(self, bg="#FFFFFF", text="").pack()
        tk.Label(self, bg="#FFFFFF", text="Created by Amos Dabush 2018").pack()
        tk.Label(self, bg="#FFFFFF", text="https://quote-me-d966f.firebaseapp.com/").pack()
        tk.Label(self, bg="#FFFFFF", text="").pack()

        start_button.pack()
        tk.Label(self, bg="#FFFFFF", text="").pack()

class PageUacErr(tk.Frame):
        def __init__(self, master):
            tk.Frame.__init__(self, master, bg="#FFFFFF")
            page_3_label = tk.Label(self, bg="#FFFFFF", text="").pack()
            page_2_label = tk.Label(self, bg="#FFFFFF", text="You most run this app as administrator!!!").pack()
            page_2_label = tk.Label(self, bg="#FFFFFF",
                                    text="Please exit and run again with administrator privilages... ").pack()
            ttk.Button(self, text="exit",command=master.destroy).pack()
            page_2_label = tk.Label(self, bg="#FFFFFF", text="").pack()
            page_2_label = tk.Label(self, bg="#FFFFFF", text="").pack()


if __name__ == "__main__":
    app = SampleApp()
    app.title("Quote-Me Notification Add-On")
    # app.iconbitmap(r'qm.ico')

    app.mainloop()