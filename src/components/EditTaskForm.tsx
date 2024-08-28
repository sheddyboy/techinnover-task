"use client";
import { addTaskFormSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { formatFileSize } from "@/utils";
import Dropzone from "react-dropzone";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Image from "next/image";
import { uploadFile } from "@/utils/supabase/client";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/TimePicker";
import { Badge } from "./ui/badge";
import { updateTask } from "@/actions/task";
import useStore from "@/store";
import { getQueryClient } from "@/lib/reactQuery";

interface EditTaskFormProps {}

const EditTaskForm = ({}: EditTaskFormProps) => {
  const queryClient = getQueryClient();
  const { currentCategory, setEditTaskModal, currentTask } = useStore();
  const [currentFile, setCurrentFile] = useState<File | null | string>(
    currentTask?.image ?? "",
  );
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const form = useForm<z.infer<typeof addTaskFormSchema>>({
    resolver: zodResolver(addTaskFormSchema),
    defaultValues: {
      taskName: currentTask?.name ?? "",
      category: currentTask?.category,
      deadLine: currentTask?.deadline,
      description: currentTask?.description ?? "",
      priority: currentTask?.priority,
      uploadCover: currentTask?.image ?? "",
    },
  });
  function onSubmit(values: z.infer<typeof addTaskFormSchema>) {
    console.log("values", values);
    currentTask &&
      toast.promise(
        updateTask({
          name: values.taskName,
          description: values.description ?? "",
          priority: values.priority,
          deadline: values.deadLine,
          category: values.category,
          image: values.uploadCover ?? "",
          id: currentTask.id,
        }),
        {
          loading: "Updating Task...",
          success: async ({ data, error }) => {
            if (error) {
              throw error;
            }
            await queryClient.invalidateQueries({ queryKey: ["tasks"] });
            setEditTaskModal({ showModal: false, category: currentCategory });
            return `Task updated`;
          },
          error: (error) => {
            return `${error.message}`;
          },
        },
      );
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-[50px]"
      >
        <div className="flex flex-col gap-[20px]">
          <FormField
            control={form.control}
            name="taskName"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[6px]">
                <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                  Task Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter task name"
                    {...field}
                    className="mt-0 h-auto rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[16px] font-normal leading-[24px] placeholder:text-[#848585]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[6px]">
                <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                  Description{" "}
                  <span className="text-[14px] font-normal leading-[20px] text-[#848585]">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write more on the task...."
                    {...field}
                    className="h-[96px] resize-none rounded-[12px] border border-[#D0D5DD] px-[14px] py-[16px] text-[16px] font-normal leading-[24px] placeholder:text-[#848585]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[6px]">
                <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                  Priority
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="h-auto rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[16px] font-normal leading-[24px] text-[#848585] placeholder:text-[#848585]">
                      <SelectValue placeholder="Select the priority of the task" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent
                    className="right-[8px] top-[32px] ml-auto w-[189px] max-w-[189px] rounded-[6px] border border-[#D0D5DD]"
                    position="item-aligned"
                  >
                    <SelectItem
                      value="high"
                      className="rounded-none pl-[12px] focus:bg-[#4F9C20]/10"
                    >
                      <Badge variant={"high"} className="capitalize">
                        High
                      </Badge>
                    </SelectItem>
                    <SelectItem
                      value="medium"
                      className="rounded-none pl-[12px] focus:bg-[#3069FE]/10"
                    >
                      <Badge variant={"medium"} className="capitalize">
                        Medium
                      </Badge>
                    </SelectItem>
                    <SelectItem
                      value="low"
                      className="rounded-none pl-[12px] focus:bg-[#E60C02]/[3%]"
                    >
                      <Badge variant={"low"} className="capitalize">
                        Low
                      </Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="hidden flex-col gap-[6px]">
                <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                  Category
                </FormLabel>
                <FormControl>
                  <Input
                    type="hidden"
                    placeholder="Category"
                    {...field}
                    className="mt-0 h-auto rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[16px] font-normal leading-[24px] placeholder:text-[#848585]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="uploadCover"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-[6px]">
                <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                  Upload cover{" "}
                  <span className="text-[14px] font-normal leading-[20px] text-[#848585]">
                    (Optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="hidden"
                    placeholder="Enter task name"
                    {...field}
                  />
                </FormControl>
                <div className="min-h-[126px] rounded-[8px] border border-[#E4E7EC]">
                  {currentFile ? (
                    <div className="flex h-full w-full items-center gap-1 px-4 py-[19.5px]">
                      <div className="flex flex-1 gap-2">
                        <Image
                          alt="task-image"
                          src={
                            typeof currentFile === "string"
                              ? currentFile
                              : URL.createObjectURL(currentFile)
                          }
                          className="flex max-h-[87px] rounded-[4px] object-cover object-center"
                          width={187}
                          height={87}
                        />
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex flex-1 flex-col text-[14px] font-medium leading-[20px] text-[#344054]">
                            <span>
                              {typeof currentFile === "string"
                                ? ""
                                : currentFile.name}
                            </span>
                            <span className="text-[14px] font-normal leading-[20px] text-[#667085]">
                              {typeof currentFile === "string"
                                ? ""
                                : formatFileSize(currentFile.size)}
                            </span>
                          </div>
                          <div className="flex items-center gap-[12px]">
                            <Progress
                              value={
                                uploadCompleted
                                  ? 100
                                  : typeof currentFile === "string"
                                    ? 100
                                    : 30
                              }
                              className="h-[8px] rounded-[4px]"
                            />
                            <span className="text-[14px] font-medium leading-[20px] text-[#344054]">
                              {uploadCompleted
                                ? "100%"
                                : typeof currentFile === "string"
                                  ? "100%"
                                  : "30%"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={"link"}
                        className="h-auto p-0"
                        onClick={() => {
                          form.setValue("uploadCover", "");
                          setCurrentFile(null);
                        }}
                      >
                        <Image
                          alt="delete-icon"
                          src={"/icons/delete-icon.svg"}
                          width={20}
                          height={20}
                        />
                      </Button>
                    </div>
                  ) : (
                    <Dropzone
                      accept={{
                        "image/jpeg": [".jpg", ".jpeg"],
                        "image/png": [".png"],
                      }}
                      maxSize={5 * 1024 * 1024}
                      maxFiles={1}
                      onDrop={(acceptedFiles) => {
                        if (acceptedFiles.length > 0) {
                          console.log(acceptedFiles);
                          setCurrentFile(acceptedFiles[0]);
                          toast.promise(uploadFile(acceptedFiles[0]), {
                            loading: "Uploading...",
                            success: ({ data, error }) => {
                              if (error) {
                                throw error;
                              }
                              form.setValue("uploadCover", data);
                              setUploadCompleted(true);
                              return "Uploaded";
                            },
                            error: (error) => {
                              form.setValue("uploadCover", "");
                              return error.message;
                            },
                          });
                        }
                      }}
                      onDropRejected={(rejectedFiles, event) => {
                        toast.error(rejectedFiles[0].errors[0].message);
                      }}
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className="flex flex-col items-center justify-center gap-[12px] px-6 py-4"
                        >
                          <Image
                            alt="upload-icon"
                            src={"/icons/upload-icon.svg"}
                            width={40}
                            height={40}
                            className="h-[40px] w-[40px]"
                          />
                          <div className="flex flex-col gap-1">
                            <div className="text-[14px] font-normal leading-[20px] text-[#667085]">
                              <span className="cursor-pointer font-medium text-[#6941C6]">
                                Click to upload
                              </span>{" "}
                              or drag and drop
                            </div>
                            <span className="text-center text-[12px] font-normal leading-[18px] text-[#667085]">
                              PNG or JPG
                            </span>
                          </div>
                          <input {...getInputProps()} />
                        </div>
                      )}
                    </Dropzone>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center gap-4">
            <FormField
              control={form.control}
              name="deadLine"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-[6px]">
                  <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                    Deadline
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="flex h-auto items-center justify-between rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[16px] font-normal leading-[24px] text-[#848585] placeholder:text-[#848585]"
                        >
                          {field.value ? (
                            format(field.value, "MMM do yyyy")
                          ) : (
                            <span>Due date</span>
                          )}
                          <Image
                            alt="calendar-icon"
                            src={"/icons/calendar-icon.svg"}
                            width={16}
                            height={16}
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="deadLine"
              render={({ field }) => (
                <FormItem className="flex flex-1 flex-col gap-[6px]">
                  <FormLabel className="text-[14px] font-medium leading-[20px] text-[#1A1919]">
                    Time
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className="flex h-auto items-center justify-between rounded-[12px] border border-[#D0D5DD] px-[14px] py-[12px] text-[16px] font-normal leading-[24px] text-[#848585] placeholder:text-[#848585]"
                        >
                          {field.value ? (
                            format(field.value, "h:mm a").toLowerCase()
                          ) : (
                            <span>Due time</span>
                          )}
                          <Image
                            alt="clock-icon"
                            src={"/icons/clock-icon.svg"}
                            width={16}
                            height={16}
                          />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3" align="start">
                      <TimePicker date={field.value} setDate={field.onChange} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="h-auto w-full rounded-[12px] bg-[#4F35F3] py-[12px] text-[16px] leading-[24px] hover:bg-[#4F35F3]/80"
          >
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditTaskForm;
