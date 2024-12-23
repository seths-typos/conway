import sys
import os

directory = sys.argv[1]

# process characters

def process(code):
	arr = []
	i = 0
	j = 0
	while i < len(code):
		cur = code[i]

		if (cur.isdigit()):
			amt = int(cur)
			if i + 1 < len(code):
				aft = code[i+1]
				tester = aft

				if aft.isdigit():
					amt = int(cur+aft)
					tester = code[i+2]
					i+=1

				for _ in range(amt):
					if (tester == "o"):
						arr.append(j)

					j += 1

			i += 1
		else:
			if (code[i] == "o"):
				arr.append(j)
			j += 1 

		i+=1

	return (arr)

# write new file
file_path = "docs/src/js/letters.js"

letter_file = open(file_path, "w")

letter_file.write("const LETTERS = {")

json = ""

for root, dirs, files in os.walk(directory, topdown=False):
	for d in dirs:

		json += "\n\t\'"+d+"\': {"

		for root, dirs, files in os.walk(os.path.join(directory, d), topdown=False):
			file_idx = 0
			for file in files:
				file_idx += 1

				if file[0] == ".":
					continue

				with open(os.path.join(root, file), 'r') as f:
					lines = ""
					i = 0

					print(file)
					
					for line in f:

						if (i > 1 and line != "!\n"):
							lines = lines + line.strip(' \n!')
						i = i+1

					lines = lines.split("$")
					f.close()

				processed_lines = []
				longest = 0
				for line in lines:	
					processed = process(line)

					if (len(processed) > 0 and processed[-1] + 1 > longest):
						longest = processed[-1] + 1


					processed_lines.append(processed)
					print(line)
					if(line[-1].isdigit()):
						for _ in range(int(line[-1])-1):
							processed_lines.append([])

				i = 0
				json += "\n\t\t\'"+file.split(".")[0].replace('_', '')+"\': {\n\t\t\t\'width\':" + str(longest)+",\n\t\t\t\'code\': \'["
				while i < len(processed_lines):
					arr = '{\"'+str(i)+'\": ['

					for char in processed_lines[i]:
						arr = arr + str(char) +', '

					if (len(processed_lines[i])>0):
						arr = arr[:-2] + ']}'
					else:
						arr = arr + ']}'

					if i == len(processed_lines) - 1:
						arr += "]\'\n\t\t}"

						if file_idx != len(files):
							arr += ","
					else:
						arr += ","

					i+=1

					json += arr
			
		json += "\n\t},"
letter_file.write(json[0:-1] + "\n}")
letter_file.close()


