library(tidyverse)

myvars <- c("Subject","MD5","TrialType","Number","Element","Experiment","Item", "Question", "Response","null","RT")
#<- c() = combines all values in a list into one variable

data.all <- read.csv('/Users/kcron/Documents/Loon/loonresults.txt',
                     header=0,
                     sep=",",
                     comment.char="#",
                     col.names=myvars,
                     fill = TRUE)
#bringing the results into R, read.csv implies comma separated values

answers <- read.delim('/Users/kcron/Documents/Loon/loonanswers.txt',
                      header=1,
                      sep=",")
#bringing answers into R, read.delim implies file is formatted as a table

feedbackvars <- c("Subject","MD5","Question","Response","Ungrammatical")

data.feedbackcat <- read.csv('C:/Users/kcron/Documents/GitHub/loon/analysis/feedbackcategorized.csv',
                             header=1,
                             sep=",",
                             col.names=feedbackvars)

answers$Item <- as.factor(as.character(answers$Item))
#defines column "Item" in "answers" dataframe

data.age <- droplevels(subset(data.all, Experiment == "intro" & Question == "age"))
#data.age defining which data deals with the age of the participants
#droplevels removes unwanted levels from the factor data.all except for what comes after the comma

data.feedback <- droplevels(subset(data.all, Experiment == "debrief"))
write.csv(data.feedback,"feedback.csv")

data.instruction <- droplevels(subset(data.all, Experiment == "prepractice"))
#similar to above

data.age$Response <- as.numeric(as.character(data.age$Response))
#defines column "Response" in "data.age" dataframe

mean(data.age$Response)
#calculating the mean of the factor data.age$Response

data.exp <- droplevels(subset(data.all, Experiment %in% c("LOON-AnimInsitu","LOON-AnimMoved","LOON-InanInsitu","LOON-InanMoved") & Question == "NULL"))
#defining which data from the experiment is relevant
#"%in%" checks if item is contained within a certain vector or dataframe
#this is finding where "Experiment" is within the list defined after "c(" and excepting what it finds from the droplevel

xtabs(~Item + Experiment, data = data.exp)
#xtabs creates a table (based on the factors Item and Experiment using data.exp?)

data.exp$Displacement <- ifelse(data.exp$Experiment=='LOON-AnimInsitu' | data.exp$Experiment=='LOON-InanInsitu', 'In Situ', 'Moved')
#defines column "Displacement" in "data.exp" dataframe 
#ifelse(test_expression, x, y), if test_expression is true return x, if false return y
#here, x=in situ and y=moved
#this basically is categorizing data from the experiment based on displacement

data.exp$Animacy <- ifelse(data.exp$Experiment=='LOON-AnimInsitu' | data.exp$Experiment=='LOON-AnimMoved', 'Animate', 'Inanimate')
#defines column "Animacy" in "data.exp" dataframe 
#ifelse(test_expression, x, y), if test_expression is true return x, if false return y
#here, x=animate and y=inanimate
#this basically is categorizing data from the experiment based on displacement

data.exp <- left_join(data.exp,answers)
#joins two tables (data.exp and answers) together

data.exp$PD <- as.character(data.exp$PD)
#defines column "PD" in table "data.exp" as a character

data.exp$Response <- as.character(data.exp$Response)
#defines column "Response" in table "data.exp" as a character

data.exp$Answer <- ifelse(data.exp$Response == data.exp$PD, 1, 0)
#defines column "answer" in "data.exp" 
#if data.exp$Response is exactly equal to data.exp$PD, return 1 if true, 0 if false

data.exp <- left_join(data.exp,data.feedbackcat, by = c("Subject", "MD5"))
data.exp$Ungrammatical <- ifelse(data.exp$Ungrammatical == "YES",1,0)
#mean(data.exp$Ungrammatical)
#above was setting up the data to have statistics done to it

#data.age <- droplevels(subset(data.all, Experiment == "intro" & Question == "age"))

data.exp <- left_join(data.exp,data.age, by = c("Subject", "MD5"))

accuracy.summary.by.subj <- data.exp %>%
#%>% is still a bit confusing, helps with nesting arguments though
  
  group_by(MD5, Animacy, Displacement) %>%
  summarise(mean.PD = mean(Answer))
#grouping the data based on variables MD5, Animacy, and Displacement
#summarize creates new dataframe, one column for each grouped variable and one for the summary statistic (mean here)

accuracy.summary.by.ungrammaticality <- data.exp %>%
  group_by(Ungrammatical, MD5,Animacy, Displacement) %>%
  summarise(mean.PD = mean(Answer))

accuracy.summary.by.age <- data.exp %>%
  group_by(Response, Animacy, Displacement) %>%
  summarise(mean.PD = mean(Answer))

#write.csv(data.feedback,"C:\\Users\\kcron\\Documents\\Loon\\feedbackpractice.csv", row.names = FALSE)


accuracy.summary <- accuracy.summary.by.subj %>%
  group_by(Animacy, Displacement) %>%
  summarise(mean = mean(mean.PD),
            SEM = sd(mean.PD)/sqrt(n_distinct(MD5)),
            ci.lower.mean = mean - qt(.975,df=n_distinct(MD5)-1)*SEM,
            ci.upper.mean = mean + qt(.975,df=n_distinct(MD5)-1)*SEM)

accuracy.summary.ungrammaticality <- accuracy.summary.by.ungrammaticality %>%
  group_by(Ungrammatical, Animacy, Displacement) %>%
  summarise(mean = mean(mean.PD),
            SEM = sd(mean.PD)/sqrt(n_distinct(MD5)),
            ci.lower.mean = mean - qt(.975,df=n_distinct(MD5)-1)*SEM,
            ci.upper.mean = mean + qt(.975,df=n_distinct(MD5)-1)*SEM)

#similar to above
#SEM = another summary statistic function, i believe here it is for finding standard deviation
#cis are finding the confidance interval of the mean

ggplot(data=accuracy.summary)+
  aes(x = Displacement, y = mean, fill = Displacement)+
  geom_bar(position = 'dodge',stat = "identity") +
  ylim(0,1)+
  geom_linerange(stat='identity',position = position_dodge(width = 0.9),mapping=aes(ymax = ci.upper.mean,ymin=ci.lower.mean)) +
  ylab("Proportion PD Response")+
  facet_grid(.~Animacy)+
  scale_fill_grey()+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")
#ggplot is from tidyverse, used for creating data visualizations

ggplot(data=accuracy.summary.ungrammaticality)+
  aes(x = Displacement, y = mean, fill = Displacement)+
  geom_bar(position = 'dodge',stat = "identity") +
  ylim(0,1)+
  geom_linerange(stat='identity',position = position_dodge(width = 0.9),mapping=aes(ymax = ci.upper.mean,ymin=ci.lower.mean)) +
  ylab("Proportion PD Response")+
  facet_grid(Animacy~Ungrammatical)+
  scale_fill_grey()+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")

ggplot(data=accuracy.summary.by.age)+
  aes(x = Displacement, y = mean.PD, fill = Displacement)+
  geom_bar(position = 'dodge',stat = "identity") +
  ylim(0,1)+
  geom_dotplot(
    mapping = NULL,
    data = NULL,
    position = "identity",
    binwidth = NULL,
    binaxis = "x",
    method = "dotdensity",
    binpositions = "bygroup",
    stackdir = "up",
    stackratio = 1,
    dotsize = 1,
    stackgroups = FALSE,
    origin = NULL,
    right = TRUE,
    width = 0.9,
    drop = FALSE,
    na.rm = FALSE,
    show.legend = NA,
    inherit.aes = TRUE
  )+
  ylab("Proportion PD Response")+
  facet_grid(Animacy~Response)+
  scale_fill_grey()+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")

RT.summary.by.subj <- data.exp %>%
  group_by(MD5, Animacy, Displacement, Answer) %>%
  summarise(mean.RT = mean(RT))

RT.summary <- RT.summary.by.subj %>%
  group_by(Animacy, Displacement, Answer) %>%
  summarise(mean = mean(mean.RT),
            SEM = sd(mean.RT)/sqrt(n_distinct(MD5)))
#similarly regrouping the data based on the defined variables "MD5, Animacy, Displacement, Answer"for summary.by.subj ad "Animacy, Displacement, answer" for RT.summary

RT.summary$Answer <- ifelse(RT.summary$Answer == 1,"PD","DO")
#ifelse for applying whether the subject responded PD or DO?

ggplot(data=RT.summary,
       aes(x=Answer, y=mean,
           fill=Answer)) +
  geom_bar(position = 'dodge',stat = "identity") +
  geom_linerange(stat='identity',position = position_dodge(width = 0.9),mapping=aes(ymax = mean+SEM,ymin=mean-SEM)) +
  theme(text = element_text(size=22)) +
  #scale_fill_manual(values = c("#173b75","#a01919"))+
  scale_fill_grey()+
  scale_x_discrete("Dependency") +
  scale_y_continuous("RT (ms)")+
  coord_cartesian(ylim = c(1500, 4000))+
  facet_grid(Displacement~Animacy)+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")
#tidyverse data visualization
