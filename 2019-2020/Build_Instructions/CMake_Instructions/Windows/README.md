*Note: that these instructions assume you have successfully pulled the project from git
	  and other Visual Studio versions not garunteed to work. 
	  This tutorial also does not cover the creation of the file `CMakeLists.txt`.*

# Windows Instructions *(using Visual Studio 2017(VS-17))*
---
## Requirements
  * Visual Studio 2017 is installed the machine
  * You have cloned the project CMake_CrossCompatabilityTest from [GitHub](https://github.com/cathysandstrom/CMake_CrossCompatabilityTest)
	- Note that these instructions can work in general cases, but its tailored specifically to this project. 
----

1. 	Download the installer for the cmake gui from their website [https://cmake.org/download/](https://cmake.org/download/).  
	a. Download the Windows Installer: (version 3.15.2 used by instructions)   
			
            cmake-3.15.2-win64-x64.msi  
				OR  
			cmake-3.15.2-win32-x86.msi  

	b. Run the downloaded installer, and follow the installer instructions.
            
2. 	Open the folder containing the project from git, and create a new folder called *build*

3. 	Open the CMake GUI which should be in your Start menu under Program Files or the location you selected. Select the source code location to be the folder containing the CMakeLists.txt file and the build the binaries path being the new build folder. 

        Where the source code is -  	${YOUR_PATH}/CMake_CrossCompatabilityTest
        Where to build the binaries -  	${YOUR_PATH}/CMake_CrossCompatabilityTest/build

4. Select the configure button on the bottom left. Select `Visual Studio 15 2017` as the generator for the project. All other options are ok, so click Finish.  

	***NOTE:*** If you do not have Visual Studio 2017 installed, the files will fail to be generated. To change the the generator, simply delete the new files generated in build folder, and go to the top right of the GUI and select `File>Delete Cache`.

5. Once the program is done being configured, there should be options in red showing the new configuration options generated. These settings haven't been applied yet, so you need to select the button Generate to do this. 

	***NOTE:*** to change the generated settings, follow the instructions from the note in step 4, and start again from there. 
    
6. With the correct files generated, use the button next to Generate called `Open Project` to do just that; open the project!

	***NOTE:*** Make sure you have `C++ CMake tools for Windows` from the installation package `Desktop development with C++`, it is an optional checkbox. 

7. Inside of the Solution Explorer in VS-17, you will have three projects in the Solution `CrossPlatformTutorial`. The only project you need to reference is called `CrossPlatformTutorial (Visual Studio 2017)`. Take some time to explore the project:
    * Other directories and their files that are not included in `CMakeLists.txt` are not in the VS-17 project (For example, `Build_Instructions/*`).
	* The header files (`.h`) are located in the `Header Files` folder  
	* The cpp files (`.cpp`) are located in the `Source Files` folder.
	* Changes made to the `.cpp` and `.h` files are updated in the main directory as well. 

8. Right click the project name and select `Set as StartUp Project` from the drop down menu. This will tell VS-17 which project needs to be built and ran. The project is now ready to be ran! 

9. Run the project using the green arrow in the top bar with `Local Windows Debugger` next to it. 
		The output should be be the executed program: (note - this output may be outdated)
 	```
	    	class A has been created!
            Hey! Class B was made too!
            I'm talking class A!
            Hello! I'm saying Class B!

            This amazingly complex code shall change the world. (Hello World!)
	```
You can now run and edit the code! 

**Concluding Notes:**
* Set up is finished after steps 1-6, and do not need to be repeated. 
		
* When you make changes to CMakeLists.txt, the project will ask to be reloaded after you hit the play button to run the executable. 

* Unless you did it perfectly the first time, you may need to redo this process with the 
correct dependencies. If that is the case, delete the contents of the build folder and 
start again from step 4 (Don't worry, I did this multiple times). 