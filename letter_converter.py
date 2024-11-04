import sys

file = sys.argv[1]

with open(file, 'r') as f:
	for line in f:
		pass
	lines = line[:-2].split("$")

	f.closed

# process characters
def add_char_to_arr(char, arr):
	if char == "b":
		arr.append(0)
	elif char == "o":
		arr.append(1)

def process(code):
	arr = []

	i = 0
	while i < len(code):
		if (code[i].isdigit()):
			amt = int(code[i])
			
			for _ in range(amt):
				add_char_to_arr(code[i+1],arr)

			i+=1
		else:
			add_char_to_arr(code[i],arr)

		i+=1

	return (arr)

processed_lines = []
for line in lines:	
	processed_lines.append(process(line))


longest = (len(max(processed_lines, key=len)))

for line in processed_lines:
	dif = longest - len(line)
	
	for _ in range(dif):
		line.append(0)

# write new file
new_file = file.split(".")[0][-3:]

file_path = "App/Assets/Letters/"+new_file+".js"

f = open(file_path, "w")

i = 0
f.write("const "+new_file[0].upper()+" = {\n\t\"width\":" + str(longest)+",\n\t\"rows\": [\n")

while i < len(processed_lines):
	arr = '\t\t['

	for char in processed_lines[i]:
		arr = arr + str(char) +', '

	arr = arr[:-2] + ']'

	if i == len(processed_lines) - 1:
		arr += "\n\t]\n}"
	else:
		arr += ", \n"

	i+=1

	f.write(arr)

f.close()


