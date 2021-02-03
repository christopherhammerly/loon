library(tidyverse)

mycols <- c("Subject","MD5","TrialType","Number","Element","Experiment","Item", "Question", "Response","null","RT")

data.all <- read.csv('/Users/chrishammerly/Desktop/Loon/main/results.txt',
                     header = 0, 
                     sep = ",",
                     quote = "",
                     comment.char = "#",
                     col.names=mycols,
                     fill = TRUE)


answers <- read.delim('/Users/chrishammerly/Desktop/Loon/main/answers.txt',
                      header = 1,
                      sep = ",")
answers$Item <- as.factor(as.character(answers$Item))

data.age <- droplevels(subset(data.all, Experiment == "intro" & Question == "age"))
data.instruction <- droplevels(subset(data.all, Experiment == "prepractice"))

data.age$Response <- as.numeric(as.character(data.age$Response))

mean(data.age$Response)




data.exp <- droplevels(subset(data.all, Experiment %in% c("LOON-AnimInsitu","LOON-AnimMoved","LOON-InanInsitu","LOON-InanMoved") & Question == "NULL"))
xtabs(~Item + Experiment, data = data.exp)

#data.exp <- droplevels(subset(data.all, Experiment %in% c("LOON-AnimInsitu","LOON-AnimMoved","LOON-InanInsitu","LOON-InanMoved") & Question == "NULL" & Response != "NULL"))

data.exp$Displacement <- ifelse(data.exp$Experiment=='LOON-AnimInsitu' | data.exp$Experiment=='LOON-InanInsitu', 'In Situ', 'Moved')
data.exp$Animacy <- ifelse(data.exp$Experiment=='LOON-AnimInsitu' | data.exp$Experiment=='LOON-AnimMoved', 'Animate', 'Inanimate')

data.exp <- left_join(data.exp,answers)

data.exp$PD <- as.character(data.exp$PD)
data.exp$Response <- as.character(data.exp$Response)

data.exp$Answer <- ifelse(data.exp$Response == data.exp$PD, 1, 0)


accuracy.summary.by.subj <- data.exp %>%
  #filter(Verb != "recommend") %>%
  group_by(MD5, Animacy, Displacement) %>%
  summarise(mean.PD = mean(Answer))

accuracy.summary <- accuracy.summary.by.subj %>%
  group_by(Animacy, Displacement) %>%
  summarise(mean = mean(mean.PD),
            SEM = sd(mean.PD)/sqrt(n_distinct(MD5)),
            ci.lower.mean = mean - qt(.975,df=n_distinct(MD5)-1)*SEM,
            ci.upper.mean = mean + qt(.975,df=n_distinct(MD5)-1)*SEM)

ggplot(data=accuracy.summary)+
  aes(x = Displacement, y = mean, fill = Displacement)+
  geom_bar(position = 'dodge',stat = "identity") +
  ylim(0,1)+
  geom_linerange(stat='identity',position = position_dodge(width = 0.9),mapping=aes(ymax = ci.upper.mean,ymin=ci.lower.mean)) +
  ylab("Proportion PD Response")+
  facet_grid(.~Animacy)+
  scale_fill_grey()+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")



data.reg <- data.exp

data.reg$Animacy <- ifelse(data.reg$Animacy == "Animate", .5, -.5)
data.reg$Displacement <- ifelse(data.reg$Displacement == "In Situ", .5, -.5)
data.reg$Structure <- ifelse(data.reg$Answer == 1, .5, -.5)

data.reg$MD5 <- as.factor(data.reg$MD5)
data.reg$Item <- as.factor(data.reg$Item)

library(lmerTest)

accuracy.lmer <- glmer(Answer ~ Animacy*Displacement
                       + (1|MD5)
                       + (0 + Animacy|MD5)
                       + (0 + Displacement|MD5)
                       + (0 + Animacy:Displacement|MD5)
                       + (1|Item)
                       + (0 + Animacy|Item)
                       + (0 + Displacement|Item)
                       + (0 + Animacy:Displacement|Item),
                       family='binomial',data=data.reg,glmerControl(optimizer='bobyqa',optCtrl=list(maxfun=1000000)))
summary(accuracy.lmer)


differences.by.subj.inaninmate <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Inanimate" & Displacement == "In Situ") %>%
  summarise(insitu.mean = mean(Answer))

differences.by.subj.inaninmate <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Inanimate" & Displacement == "Moved") %>%
  summarise(moved.mean = mean(Answer)) %>%
  right_join(differences.by.subj.inaninmate)

differences.by.subj.inaninmate <- differences.by.subj.inaninmate %>%
  group_by(MD5) %>%
  summarise(Difference = moved.mean-insitu.mean) %>%
  right_join(differences.by.subj.inaninmate)

# traditional and Bayesian t-tests for effect of attractor number on E1 ungrammatical conditions

t.test(differences.by.subj.inaninmate$Difference)



differences.by.subj.aninmate <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Animate" & Displacement == "In Situ") %>%
  summarise(insitu.mean = mean(Answer))

differences.by.subj.aninmate <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Animate" & Displacement == "Moved") %>%
  summarise(moved.mean = mean(Answer)) %>%
  right_join(differences.by.subj.aninmate)

differences.by.subj.aninmate <- differences.by.subj.aninmate %>%
  group_by(MD5) %>%
  summarise(Difference = moved.mean-insitu.mean) %>%
  right_join(differences.by.subj.aninmate)
# traditional and Bayesian t-tests for effect of attractor number on E1 ungrammatical conditions

t.test(differences.by.subj.aninmate$Difference)




differences.by.subj.insitu <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Animate" & Displacement == "In Situ") %>%
  summarise(animate.mean = mean(Answer))

differences.by.subj.insitu <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Inanimate" & Displacement == "In Situ") %>%
  summarise(inanimate.mean = mean(Answer)) %>%
  right_join(differences.by.subj.insitu)

differences.by.subj.insitu <- differences.by.subj.insitu %>%
  group_by(MD5) %>%
  summarise(Difference = animate.mean-inanimate.mean) %>%
  right_join(differences.by.subj.insitu)
# traditional and Bayesian t-tests for effect of attractor number on E1 ungrammatical conditions

t.test(differences.by.subj.insitu$Difference)




differences.by.subj.moved <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Animate" & Displacement == "Moved") %>%
  summarise(animate.mean = mean(Answer))

differences.by.subj.moved <- data.exp %>% 
  group_by(MD5) %>%
  filter(Animacy == "Inanimate" & Displacement == "Moved") %>%
  summarise(inanimate.mean = mean(Answer)) %>%
  right_join(differences.by.subj.moved)

differences.by.subj.moved <- differences.by.subj.moved %>%
  group_by(MD5) %>%
  summarise(Difference = animate.mean-inanimate.mean) %>%
  right_join(differences.by.subj.moved)
# traditional and Bayesian t-tests for effect of attractor number on E1 ungrammatical conditions

t.test(differences.by.subj.moved$Difference)




accuracy.summary.by.subj.verb <- data.exp %>%
  group_by(Subject, Verb, Animacy, Displacement) %>%
  summarise(mean.PD = mean(Answer))

accuracy.summary.verb <- accuracy.summary.by.subj.verb %>%
  group_by(Verb, Animacy, Displacement) %>%
  summarise(mean = mean(mean.PD),
            SEM = sd(mean.PD)/sqrt(n_distinct(Subject)),
            ci.lower.mean = mean - qt(.975,df=n_distinct(Subject)-1)*SEM,
            ci.upper.mean = mean + qt(.975,df=n_distinct(Subject)-1)*SEM)


ggplot(data=accuracy.summary.verb)+
  aes(x = Displacement, y = mean, fill = Displacement)+
  geom_bar(position = 'dodge',stat = "identity") +
  ylim(0,1)+
  geom_linerange(stat='identity',position = position_dodge(width = 0.9),mapping=aes(ymax = ci.upper.mean,ymin=ci.lower.mean)) +
  ylab("Proportion PD Response")+
  facet_grid(Verb~Animacy)+
  scale_fill_grey()+
  theme_minimal(base_size = 12,base_family = "Charter")+ theme(legend.position="none")


RT.summary.by.subj <- data.exp %>%
  group_by(MD5, Animacy, Displacement, Answer) %>%
  summarise(mean.RT = mean(RT))

RT.summary <- RT.summary.by.subj %>%
  group_by(Animacy, Displacement, Answer) %>%
  summarise(mean = mean(mean.RT),
            SEM = sd(mean.RT)/sqrt(n_distinct(MD5)))

RT.summary$Answer <- ifelse(RT.summary$Answer == 1,"PD","DO")

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


rt.regression.moved <-  lmer(RT ~ Structure*Animacy
                            + (1|MD5)
                            + (0+Structure|MD5)
                            + (0+Animacy|MD5)
                            + (0+Animacy:Structure|MD5)
                            + (1|Item)
                            + (0+Structure|Item)
                            + (0+Animacy|Item)
                            + (0+Animacy:Structure|Item),data=subset(data.reg, Displacement == -.5))


summary(rt.regression.moved)


rt.regression.insitu <-  lmer(RT ~ Structure*Animacy
                             + (1|MD5)
                             + (0+Structure|MD5)
                             + (0+Animacy|MD5)
                             + (0+Animacy:Structure|MD5)
                             + (1|Item)
                             + (0+Structure|Item)
                             + (0+Animacy|Item)
                             + (0+Animacy:Structure|Item),data=subset(data.reg, Displacement == .5))


summary(rt.regression.insitu)


rt.regression <-  lmer(RT ~ Structure*Animacy*Displacement
                              + (1|Subject)
                              + (0+Structure|Subject)
                              + (0+Animacy|Subject)
                              + (0+Displacement|Subject)
                              + (0+Animacy:Structure|Subject)
                              + (0+Displacement:Structure|Subject)
                              + (0+Animacy:Displacement|Subject)
                              + (0+Animacy:Structure:Displacement|Subject)
                              + (1|Item)
                              + (0+Structure|Item)
                              + (0+Animacy|Item)
                              + (0+Displacement|Item)
                              + (0+Animacy:Structure|Item)
                              + (0+Displacement:Structure|Item)
                              + (0+Animacy:Displacement|Item)
                              + (0+Animacy:Structure:Displacement|Item),data=data.reg)


summary(rt.regression)

