import sys
import os

directory = sys.argv[1]

for root, dirs, files in os.walk(directory, topdown=False):
	for file in files:
		with open(os.path.join(root, file), 'r') as f:
			for line in f:
				pass
			lines = line[:-2].split("$")

			f.closed

		# process characters

		def process(code):
			arr = []
			i = 0
			j = 0
			while i < len(code):
				if (code[i].isdigit()):
					amt = int(code[i])
					
					for _ in range(amt):
						if (code[i+1] == "o"):
							arr.append(j)

						j += 1

					i += 1
				else:
					if (code[i] == "o"):
						arr.append(j)
					j += 1 

				i+=1

			return (arr)

		new_file = file.split(".")[0][-3:]

		processed_lines = []
		longest = 0
		for line in lines:	
			processed = process(line)

			if (processed[-1] + 1 > longest):
				longest = processed[-1] + 1


			processed_lines.append(process(line))


		# write new file

		file_path = "App/Assets/Letters/"+new_file[0]+".js"

		f = open(file_path, "w")

		i = 0
		f.write("const "+new_file[0].upper()+" = {\n\t\"width\":" + str(longest)+",\n\t\"code\": \'[")

		while i < len(processed_lines):
			arr = '{\"'+str(i)+'\": ['

			for char in processed_lines[i]:
				arr = arr + str(char) +', '

			arr = arr[:-2] + ']}'

			if i == len(processed_lines) - 1:
				arr += "]\'\n}"
			else:
				arr += ","

			i+=1

			f.write(arr)

		f.close()


